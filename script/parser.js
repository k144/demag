var editorContent = ""
$(() => parse("")) // tworzy bloczki startu i końca po załadowniu strony

function editorHandler(editor){
    editorContent = editor.getValue("\n");
    parse(editorContent);
}
var Blocks = new Array(); // bloczki dostępne publicznie

function getLineType(line) {
    let typeMap = new Map([
        [/\}/,                     "close-bracket"],
        [/^[a-zA-Z]+\w*\s*(=|:=)/, "data"],
        [/^(read|write)\s+/,       "io"],
        [/^(if)[^{]*$/,        "if-oneline"],
        [/^(if).*\{\s*$/,   "if-multiline"]
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
    lines.forEach((line, i)=>{

        let lineType = getLineType(line)
        let block = new Object()
        switch(lineType) {
        // bloczek danych
        case "data":
            block = {
                type: lineType,
                content: line,
                outA: i + 2,
                outB: outNull,
            };
            blocks.push(block);
            break;

        // bloczek wejścia wyjścia
        case "io":
            block = {
                type: lineType,
                content: line,
                outA: i + 2,
                outB: outNull,
            }
            blocks.push(block);
            break;
        
        // bloczek warunkowy
        // dokończyć
        case "if-oneline":
            blocks.push({
                type: lineType,
                // usuwa `if` i `{` oraz znaki białe wokół nich
                content: line
                    .replace(/(if)\s*/, "")
                    .replace(/\s*$/, ""),
                outA: i + 2,
                outB: i + 3
            });
            lines.splice(i, 2);
            break;
        case "if-multiline":
            blocks.push({
                type: lineType
            })
            break;
        }
    })
    return blocks
}

function parse(mag) {
    let lines = mag.split("\n");
    let blocks = new Array(); // bloczki dostępne tylko w tej funkcji
    blocks.push({
		"width": 0,
		"height": 0,
		"type": "start",
		"content": "start",
		"outA": 1,
		"outB": outNull
	})

    blocks.push.apply(blocks, parseLines(lines));
    
    blocks.push({
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
