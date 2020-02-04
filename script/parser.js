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
        line = line.replace(/^\s*/, "");
        line = line.replace(/(\w+\s*)=(?!=)/, "$1:=");
        result[i] = line;
    }
    console.log(result);
    return result;
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
            
            console.log(thisIf);
            console.log(blocks);
            blocks[thisIf.lastTrue.position]
                .outA = CurrentID + 1;
            console.log(blocks[thisIf.lastTrue.position]);

            break;
        }
    })
    return blocks
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
