var editorContent = ""

function editorHandler(editor){
    editorContent = editor.getValue("\n");
    parse(editorContent);
}
var Blocks = new Array(); // bloczki dostępne publicznie

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
		"content": "",
		"outA": 1,
		"outB": outNull
	})
    const dataRegExp = /^[a-zA-Z]+\w*\s*(=|:=)/;
    const ioRegExp = /^(read|write)\s+/;
    const ifRegExp = /^(if)\s+/;
    const blockOffset = 100;
    lines.forEach((line, i)=>{

        // bloczek danych
        if (dataRegExp.test(line)){
            blocks.push({
                x: blocks[blocks.length - 1].x + blockOffset,
                y: blocks[blocks.length - 1].y + blockOffset,
                width: 0,
                height: 0,
                type: "data",
                content: line,
                outA: i + 2,
                outB: outNull,
            });

        // bloczek wejścia wyjścia
        } else if (ioRegExp.test(line)) {
            blocks.push({
                x: blocks[blocks.length - 1].x + blockOffset,
                y: blocks[blocks.length - 1].y + blockOffset,
                width: 0,
                height: 0,
                type: "io",
                content: line,
                outA: i + 2,
                outB: outNull,
            });
        
        // bloczek warunkowy
        // dokończyć
        } else if (ifRegExp.test(line)) {
            blocks.push({
                type: "if",
                // usuwa `if` i `{` oraz znaki białe wokół nich
                content: line
                    .replace(/(if)\s*/, "")
                    .replace(/\s*[{]/, ""),
                outA: i + 2,
                outB: i + 3
            });
            lines.splice(i, 2);
        }
        
    })
    blocks.push({
            "x": blocks[blocks.length - 1].x + blockOffset,
            "y": blocks[blocks.length - 1].y + blockOffset,
            "width": 0,
            "height": 0,
            "type": "end",
            "content": "",
            "outA": outNull,
            "outB": outNull
        })

    Blocks = blocks; // "upublicznia" bloczki
    let output = new Array();
    blocks.forEach((block)=>output.push(
        JSON.stringify(block, null, 2)
        .replace(/\n/g, "<br>")
    ));
    document.getElementById("out")
        .innerHTML = output.join("<br><br>");
}