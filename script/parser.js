function Block(type, content){
    this.type = type;
    this.content = content;
}


var editorContent = ""

function editorHandler(editor){
    editorContent = editor.getValue("\n");
    parse(editorContent);
}
var Blocks = new Array(); // bloczki dostępne publicznie

function parse(mag) {
    let lines = mag.split("\n");
    let blocks = new Array(); // bloczki dostępne tylko w tej funkcji
    const dataRegExp = /^[a-zA-Z]+\w*\s*(=|:=)/;
    const ioRegExp = /^(read|write)\s+/;
    const ifRegExp = /^(if)\s+/;
    lines.forEach((line, i)=>{

        // bloczek danych
        if (dataRegExp.test(line)){
            blocks.push(new Block(
                "data",
                line
            ));

        // bloczek wejścia wyjścia
        } else if (ioRegExp.test(line)) {
            blocks.push(new Block(
                "io",
                line
            ));
        
        // bloczek warunkowy
        // dokończyć
        } else if (ifRegExp.test(line)) {
            blocks.push(new Block(
                "if",
                // usuwa `if` i `{` oraz znaki białe wokół nich
                line.replace(/(if)\s*/, "").replace(/\s*[{]/, "")
            ));
            lines.splice(i, 2);
        }
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