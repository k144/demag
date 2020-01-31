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

function getLineType(line) {
    let typeMap = new Map([
        [/^\s*\}\s*$/,                "close-bracket"],
        [/^\s*[a-zA-Z]+\w*\s*(=|:=)/, "data"],
        [/^\s*(read|write)\s+/,       "io"],
        [/^\s*(if)\s+.*\{\s*$/,       "if"],
        [/^\s*\}\s*(else)\s*\{\s*$/,  "else"]
    ]);
    for (let entry of typeMap) {
        let regExp = entry[0];
        let type = entry[1];
        if (regExp.test(line)) {
            return type;
        }
    }
    
}

const outNull = 4294967295; // tak oznaczone jest puste wyjście bloczka
const blockOffset = 100;

function parseLines(lines){
    let blocks = new Array(); // bloczki dostępne tylko w tej funkcji
    let ifStack = new Array();

    lines.forEach((line, i)=>{

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
                outA: CurrentID + 1,
                outB: outNull,
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
                outA: CurrentID + 1,
                outB: outNull,
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
                }
            )
            ifStack.push({head: blocks.length - 1}); // pozycja tego bloczka warunkowego w tablicy bloczków
            break;
        
        case "else":
            ifStack[ifStack.length - 1]
                .lastTrue = CurrentID
            break;
    
        case "close-bracket":
            blocks.push({
                type: "wrapper-close"
            })

            let thisIf = ifStack.pop();

            blocks[thisIf.head]
                .outA = thisIf.lastTrue + 1;

            blocks[thisIf.lastTrue]
                .outA = CurrentID + 1

            break;
        }
    })
    return blocks
}

function parse(mag) {
    let lines = mag.split("\n");
    let blocks = new Array(); // bloczki dostępne tylko w tej funkcji
    CurrentID = 0;
    blocks.push({
        "ID": CurrentID,
		"width": 0,
		"height": 0,
		"type": "start",
		"content": "start",
		"outA": 1,
		"outB": outNull
	})

    blocks.push.apply(blocks, parseLines(lines));
    
    CurrentID++;
    blocks.push({
        "ID": CurrentID,
        "width": 0,
        "height": 0,
        "type": "end",
        "content": "koniec",
        "outA": outNull,
        "outB": outNull
    })
    
    console.log(blocks);

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
