/*--- ZMIENNE GLOBALNE ---*/
var Blocks = new Array(); // bloczki dostępne publicznie
let CurrentID = 0;

// tworzy bloczki startu i końca po załadowniu strony
$(() => parse(""))

var editorContent = "";

function editorHandler(editor) {
    editorContent = editor.getValue("\n");
    parse(editorContent);
}

/** Usuwa zbędne znaki, oraz rozwija wybrane wyrażenia, np. `++` */
function preproc(lines) {
    let result = new Array();
    for (let line of lines) {
        line = line.trim(); // usuwa znaki białe na początku i końcu
        let replaceMap = new Map([
            [/^(.*[^=^>^<^!:\+\-\*\/\^])=(?!=)/, "$1:="], // = -> :=
            // x += 1    ->     x := x + 1   itd.
            [
                /^([a-zA-Z]\w*)(\s*)([\+\-\*\/\^])=(\s*)(.*)$/,
                "$1" +     // zmienna
                "$2:=$2" + // [znaki białe]:=[znaki białe]
                "$1" +     // zmienna
                "$4" +     // znaki białe po `=`
                "$3" +     // operator
                "$4" +     // znaki białe po `=`
                "$5"       // reszta
            ],
            [/^(\w+)\+\+$/, "$1 := $1+1"], // x++   ->   x := x+1
            [/^(\w+)\-\-$/, "$1 := $1-1"], // x--   ->   x := x-1
            // for i = 0 -> 4 {    ->     for i:=0; i<=4; i := i + 1 {   
            [
                /^for\s+([a-zA-Z]\w*)\s*:=\s*(\w+)\s*\->\s*(\w+)\s*\{/,
                "for $1:=$2; $1<=$3; $1 := $1+1 {"
            ]

        ]);
        for (let entry of replaceMap) {
            let regExp = entry[0];
            let out = entry[1];
            line = line.replace(regExp, out);
        }
        result.push(line);
    }
    console.log(result);
    return result;
}

function getLineType(line) {
    let typeMap = new Map([
        [/^\}$/,              "close-bracket"],
        [/^for\s+.*;.*;.*\{/, "for"],
        [/^(read|write)+/,    "io"],
        [/^if\s+.*\{$/,       "if"],
        [/^\}\s*else\s*\{$/,  "else"],
        [/^(dim|.*:=)/,       "data"],
        [/^\w*:$/,            "goto-label"],
        [/^goto\s+./,         "goto-call"]
    ]);
    for (let entry of typeMap) {
        let regExp = entry[0];
        let type = entry[1];
        if (regExp.test(line)) {
            return type;
        }
    }
    console.log(line + "\ngetLineType: Niezdefiniowany typ linii.");
    return undefined;
}

/**
 * Zamyka odpowiednie wrappery i modyfikuje bloczki.
 * Ten fragment jest dosyć długi, więc został przeniesiony
 * do osobnej funkcji. Zwraca przetworzone bloczki.
 * */
function closeBracket(blocks, thisStackElement) {
    if (thisStackElement.type == "if") {
        blocks.push(
            {
                ID: ++CurrentID,
                type: "sum",
                content: "",
                outA: CurrentID + 1
            },
            {
                type: "wrapper-close"
            }
        );
        if (thisStackElement.hasElse) {
            blocks.push(
                {
                    type: "wrapper-close"
                }
            );
            blocks[thisStackElement.head]
                .outA = thisStackElement.lastTrue.ID + 1;
            blocks[thisStackElement.lastTrue.position]
                .outA = CurrentID + 1;
        } else {
            blocks.push(
                {
                    type: "wrapper-open",
                    wrapperType: "if-false"
                },
                {
                    ID: ++CurrentID,
                    type: "sum",
                    content: "",
                    outA: CurrentID + 1
                },
                {
                    type: "wrapper-close"
                },
                {
                    type: "wrapper-close"
                }
            );
            blocks[thisStackElement.head]
                .outA = CurrentID;
            blocks[blocks.length - 6]
                .outA = CurrentID + 1;
        }
    } else if (thisStackElement.type == "for") {
        blocks.push(
            {
                ID: ++CurrentID,
                type: "data",
                content: thisStackElement.afterthought,
                outA: CurrentID + 1
            },
            {
                type: "wrapper-close"
            },
            {
                type: "wrapper-open",
                wrapperType: "for-sum"
            },
            {
                ID: ++CurrentID,
                type: "sum",
                content: "",
                outA: CurrentID + 1
            },
            {
                ID: ++CurrentID,
                type: "sum",
                content: "",
                outA: thisStackElement.condition.ID
            },
            {
                type: "wrapper-close"
            },
            {
                type: "wrapper-close"
            }
        );
        blocks[thisStackElement.condition.position]
            .outA = CurrentID + 1;
    }
    return blocks;
}

/** Tworzy bloczki, oprócz startu i stopu, na podstawie typu i treści linii. */
function parseLines(lines) {
    let blocks = new Array();
    let stack = new Array(); // stos obiektów z informacjami o for'ach i if'ach

    let gotoLabelMap = new Map();
    let gotoCallMap = new Map();

    for (let line of lines) {
        let lineType = getLineType(line);
        switch (lineType) {

            case "data":
            case "io":
                // let last = blocks.length ? blocks[blocks.length-1] : undefined;
                // if (last && last.type == lineType) {
                //     last.content += "\r\n" + line;
                //     break;
                // }
                blocks.push(
                    {
                        ID: ++CurrentID,
                        type: lineType,
                        content: line,
                        outA: CurrentID + 1
                    }
                );
                break;

            case "if":
                blocks.push(
                    {
                        type: "wrapper-open",
                        wrapperType: "if"
                    },
                    {
                        ID: ++CurrentID,
                        type: lineType,
                        content: line
                            // usuwa `if` i `{` oraz znaki białe wokół nich
                            .replace(/(if)\s*/, "")
                            .replace(/\s*\{\s*$/, ""),
                        outB: CurrentID + 1
                    },
                    {
                        type: "wrapper-open",
                        wrapperType: "if-true"
                    }
                );
                stack.push(
                    {
                        type: "if",
                        head: blocks.length - 2, // pozycja tego bloczka warunkowego w tablicy bloczków
                    }
                );
                break;

            case "else":
                stack[stack.length - 1]
                    .lastTrue = {
                    ID: ++CurrentID,
                    position: blocks.length
                };
                stack[stack.length - 1]
                    .hasElse = true;
                blocks.push(
                    {
                        ID: CurrentID,
                        type: "sum",
                        content: ""
                    },
                    {
                        type: "wrapper-close"
                    },
                    {
                        type: "wrapper-open",
                        wrapperType: "if-false"
                    }
                );
                break;

            case "for":
                let [all, initialization, condition, afterthought]
                    = /for\s+(.*);\s*(.*);\s*(.*)\{/.exec(line);
                [initialization, afterthought]
                    = preproc([initialization, afterthought]);
                blocks.push(
                    {
                        ID: ++CurrentID,
                        type: "data",
                        content: initialization,
                        outA: CurrentID + 1
                    },
                    {
                        type: "wrapper-open",
                        wrapperType: "for"
                    },
                    {
                        type: "wrapper-open",
                        wrapperType: "for-body"
                    },
                    {
                        ID: ++CurrentID,
                        type: "if",
                        content: condition,
                        outB: CurrentID + 1,
                    }
                )
                stack.push(
                    {
                        type: "for",
                        condition: {
                            ID: CurrentID,
                            position: blocks.length - 1,
                        },
                        afterthought: afterthought
                    }
                );
                break;

            case "for-range":
                blocks.push(
                    {
                        type: "if",
                        content: "range"
                    }
                );
                break;

            case "close-bracket":
                let thisStackElement = stack.pop();
                console.log(thisStackElement);
                blocks = closeBracket(blocks, thisStackElement);
                break;

            case "goto-label":
                blocks.push(
                    {
                        ID: ++CurrentID,
                        type: "sum",
                        content: "",
                        outA: CurrentID + 1
                    }
                );
                line = line.replace(":", "");
                gotoLabelMap.set(line, CurrentID)
                break;

            case "goto-call":
                blocks.push(
                    {
                        ID: ++CurrentID,
                        type: "sum",
                        content: "",
                    }
                );
                let target = line.replace(/goto\s*/, "");
                gotoCallMap.set(blocks.length - 1, target);
                break;

            default:
                console.log(lineType + "\nparseLines: Nieznany typ linii.");

        }
        // łączy etykiety z instrukcjami goto 
        for (let elem of gotoCallMap) {
            let call = elem[0];
            let label = elem[1];
            blocks[call].outA = gotoLabelMap.get(label);
        }

    }
    console.log(blocks);
    return blocks;
}

function parse(mag) {
    let lines = mag.split("\n");
    lines = preproc(lines);
    let blocks = new Array(); // bloczki dostępne tylko w tej funkcji
    CurrentID = 0;
    blocks.push({
        "ID": CurrentID,
        "type": "start",
        "content": "START",
        "outA": 1
    });
    blocks.push.apply(blocks, parseLines(lines));
    blocks.push({
        "ID": ++CurrentID,
        "type": "end",
        "content": "KONIEC"
    });
    Blocks = blocks; // "upublicznia" bloczki
    draw(Blocks);
}