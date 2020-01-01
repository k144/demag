function Block(type, content){
    this.type = type;
    this.content = content;
}

function parse(editor) {
    var mag = editor.getValue("\n");
    let lines = mag.split("\n");
    let Blocks = new Array();
    const dataRegExp = /^[a-zA-Z]+\w*\s*(=|:=)/;
    const ioRegExp = /^(read|write)\s+/;
    const ifRegExp = /^(if)\s+/;
    lines.forEach((line, i)=>{

        // bloczek danych
        console.log(line)
        if (dataRegExp.test(line)){
            Blocks.push(new Block(
                "data",
                line
            ));

        // bloczek wejścia wyjścia
        } else if (ioRegExp.test(line)) {
            Blocks.push(new Block(
                "io",
                line
            ));
        
        // bloczek warunkowy
        // dokończyć
        } else if (ifRegExp.test(line)) {
            Blocks.push(new Block(
                "if",
                // usuwa `if` i `{` oraz znaki białe wokół nich
                line.replace(/(if)\s*/, "").replace(/\s*[{]/, "")
            ));
            lines.splice(i, 2);
        }
    })
    
    var output = new Array();
    Blocks.forEach((block)=>output.push(block.type + ":<br>" + block.content + "<br>"));
    document.getElementById("out").innerHTML = output.join("<br>");
}