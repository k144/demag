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
        [/^(if)\s+\S+\s*$/,        "if-oneline"],
        [/^(if)\s+\S+\s*\{\s*$/,   "if-multiline"]
    ]);
    for (let entry of typeMap) {
        let regExp = entry[0];
        let type = entry[1];
        if (regExp.test(line)) {
            return type;
        }
    }
    
}

function parse(mag) {
    let lines = mag.split("\n");
    let blocks = new Array(); // bloczki dostępne tylko w tej funkcji
    const outNull = 4294967295; // tak oznaczone jest puste wyjście bloczka
    blocks.push({
		"x": 100,
		"y": 100,
		"width": 0,
		"height": 0,
		"type": "start",
		"content": "start",
		"outA": 1,
		"outB": outNull
	})

    const blockOffset = 100;
    lines.forEach((line, i)=>{

        let lineType = getLineType(line)
        switch(lineType) {
            // bloczek danych
            case "data":
                blocks.push({
                    x: blocks[blocks.length - 1].x + blockOffset,
                    y: blocks[blocks.length - 1].y + blockOffset,
                    width: 0,
                    height: 0,
                    type: lineType,
                    content: line,
                    outA: i + 2,
                    outB: outNull,
                })
                break;

            // bloczek wejścia wyjścia
            case "io":
                blocks.push({
                    x: blocks[blocks.length - 1].x + blockOffset,
                    y: blocks[blocks.length - 1].y + blockOffset,
                    width: 0,
                    height: 0,
                    type: lineType,
                    content: line,
                    outA: i + 2,
                    outB: outNull,
                });
                break;
            
            // bloczek warunkowy
            // dokończyć
            case "if-oneline":
                blocks.push({
                    type: lineType,
                    // usuwa `if` i `{` oraz znaki białe wokół nich
                    content: line
                        .replace(/(if)\s*/, "")
                        .replace(/\s*[{]/, ""),
                    outA: i + 2,
                    outB: i + 3
                });
                lines.splice(i, 2);
            case "if-multiline":
                blocks.push({
                    type: lineType
                })

                break;
        }
        
    })
    blocks.push({
            "x": blocks[blocks.length - 1].x + blockOffset,
            "y": blocks[blocks.length - 1].y + blockOffset,
            "width": 0,
            "height": 0,
            "type": "end",
            "content": "koniec",
            "outA": outNull,
            "outB": outNull
        })

    Blocks = blocks; // "upublicznia" bloczki
    let output = new Array();
    blocks.forEach((block) => output.push(
        JSON.stringify(block, null, 2)
        .replace(/\n/g, "<br>")
    ));
    document.getElementById("json")
        .innerHTML = output.join("<br><br>");
    draw();
}
