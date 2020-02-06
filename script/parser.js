/*--- ZMIENNE GLOBALNE ---*/
var Blocks = new Array(); // bloczki dostępne publicznie
var CurrentID = 0;

// tworzy bloczki startu i końca po załadowniu strony
$(() => parse("")) 

var editorContent = "";

function editorHandler(editor){
    editorContent = editor.getValue("\n");
    parse(editorContent);
}

function preproc(lines){
    let result = new Array(lines.length);
    for (let i = 0; i < lines.length; i++){

        let line = lines[i];
        let replaceMap = new Map([
            [/^\s*/, ""], // usuwa znaki białe na początku
            [/\s*$/, ""], // -,,- na końcu
            [/(\w+\s*)=(?!=)/, "$1:="], // = -> :=
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

        ]);
        for (let entry of replaceMap){
            let regExp = entry[0];
            let out = entry[1];
            line = line.replace(regExp, out);
        }

        result[i] = line;
    }
    console.log(result);
    return result;
}

function getLineType(line) {
    let typeMap = new Map([
        [/^\}$/,                "close-bracket"],
        [/^[a-zA-Z]\w*\s*:=/,   "data"],
        [/^(read|write)+/,      "io"],
        [/^(if)\s+.*\{$/,       "if"],
        [/^\}\s*(else)\s*\{$/,  "else"],
        [/^\w*:$/,              "goto-label"],
        [/^goto\s+./,           "goto-call"]
    ]);
    for (let entry of typeMap) {
        let regExp = entry[0];
        let type = entry[1];
        if (regExp.test(line)) {
            return type;
        }
    }
    
}

function parseLines(lines){
    let blocks = new Array(); // bloczki dostępne tylko w tej funkcji
    let ifStack = new Array();

    let gotoLabelMap = new Map();
    let gotoCallMap = new Map();

    lines.forEach((line)=>{

        let lineType = getLineType(line);
        let block = new Object();

        switch(lineType) {
        // bloczek danych
        case "data":
            CurrentID++;
            block = {
                ID: CurrentID,
                type: lineType,
                content: line,
                outA: CurrentID + 1
            };
            blocks.push(block);
            break;


        // bloczek wejścia wyjścia
        case "io":
            CurrentID++;
            block = {
                ID: CurrentID,
                type: lineType,
                content: line,
                outA: CurrentID + 1
            }
            blocks.push(block);
            break;

        case "if":
            CurrentID++;
            blocks.push(
                {
                    type: "wrapper-open",
                    wrapperType: "if"
                },
                {
                    ID: CurrentID,
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
            )
            ifStack.push({head: blocks.length - 2}); // pozycja tego bloczka warunkowego w tablicy bloczków
            break;
        
        case "else":
            CurrentID++;
            ifStack[ifStack.length - 1]
                .lastTrue = {
                    ID: CurrentID,
                    position: blocks.length
                };
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
            )
            break;
    
        case "close-bracket":
            CurrentID++;
            blocks.push(
                {
                    ID: CurrentID,
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
            )

            let thisIf = ifStack.pop();

            blocks[thisIf.head]
                .outA = thisIf.lastTrue.ID + 1;
            
            blocks[thisIf.lastTrue.position]
                .outA = CurrentID + 1;

            break;
        
        case "goto-label":
            CurrentID++;
            blocks.push(
                {
                    ID: CurrentID,
                    type: "sum",
                    content: "",
                    outA: CurrentID + 1
                }
            );
            line = line.replace(":", "");
            gotoLabelMap.set(line, CurrentID)
            break;
        case "goto-call":
            CurrentID++;
            blocks.push(
                {
                    ID: CurrentID,
                    type: "sum",
                    content: "",
                }
            );
            let target = line.replace(/goto\s*/, "");
            gotoCallMap.set(blocks.length-1, target);
            break;
        }

        // łączy etykiety z instrukcjami goto 
        for (let elem of gotoCallMap){
            let call = elem[0];
            let label = elem[1];
            blocks[call].outA = gotoLabelMap.get(label);
        }

    })
    return blocks;
}

function parse(mag) {
    let lines = mag.split("\n");
    lines = preproc(lines);
    let blocks = new Array(); // bloczki dostępne tylko w tej funkcji
    CurrentID = 0;
    blocks.push({
        "ID": CurrentID,
		"width": 0,
		"height": 0,
		"type": "start",
		"content": "START",
		"outA": 1
	})

    blocks.push.apply(blocks, parseLines(lines));
    
    CurrentID++;
    blocks.push({
        "ID": CurrentID,
        "width": 0,
        "height": 0,
        "type": "end",
        "content": "KONIEC"
    })
    
    Blocks = blocks; // "upublicznia" bloczki
    let output = new Array();
    blocks.forEach((block) => output.push(
        JSON.stringify(block, null, 2)
        .replace(/\n/g, "<br>")
    ));
    document.getElementById("json")
        .innerHTML = output.join("<br><br>");
    put(draw(Blocks));
}
