function put(content, target) {
    let board = $(target);
    board.empty();
    board.append(content);
}

function draw(blocks) {
    put(drawBlocks(blocks), "#blocks");
    put(drawJSON(blocks), "#json");
}

function drawBlocks(blocks){
    let buf = '';
    blocks.forEach((block) =>{
        switch(block.type){
        case "wrapper-open":
            buf +=
                '<div class="' +
                'block-wrapper' + ' ' +
                block.wrapperType + '-wrapper' +
                '">';
            break;
        case "wrapper-close":
            buf +=
                '</div>';
            break;
        default:
            buf +=
                '<div class="' +
                'block' + ' ' +
                'block-' + block.type +
                '" ' +
                'id="' + block.ID + '">' +
                block.content +
                '</div>';
            break;
        }
    });
    return buf;
}

function drawJSON(blocks){
    let output = new Array();
    blocks.forEach((block) => output.push(
        JSON.stringify(block, null, 2)
        .replace(/\n/g, "<br>")
    ));
    return output.join("<br><br>");
}