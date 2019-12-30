function Block(type, content){
    this.type = type;
    this.content = content;
}

function parse() {
    var mag = document.getElementById("mag").value;
    var lines = mag.split("\n");
    var Blocks = new Array();
    lines.forEach((line)=>{

        console.log(line)
        if (/^[a-zA-Z]+[a-zA-Z0-9_]*\s*(=|:=)/.test(line))  //data
            Blocks.push(new Block("data", line));

        else if (/^(read|write)\s*/.test(line))             //io
            Blocks.push(new Block("io", line));

        else if (/^(if)\s*/.test(line))
            Blocks.push(new Block("if", line));             //if
            
        else if (/^(start)\s*/.test(line))
            Blocks.push(new Block("start", line));          //start

        else if (/^(end)\s*/.test(line))
            Blocks.push(new Block("end", line));            //end
    })
    console.log(Blocks);

    var output = new Array();
    Blocks.forEach((block)=>output.push(block.type + ":<br>" + block.content + "<br>"));
    console.log(output);
    document.getElementById("out").innerHTML = output.join("<br>");
}