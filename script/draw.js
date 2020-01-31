function put(content) {
    let board = $("#blocks");
    board.empty();
    board.append(content);
}

function draw(blocks) {
    let buf = ''
    blocks.forEach((block) =>{
        switch(block.type){
        case "wrapper-open":
            buf +=
                '<div class="' +
                'block-wrapper' + ' ' +
                block.wrapperType + '-wrapper' +
                '">'
            break;
        case "wrapper-close":
            buf +=
                '</div>'
            break;
        default:
            buf +=
                '<div class="' +
                'block' + ' ' +
                'block-' + block.type +
                '" ' +
                'id="' + block.ID + '">' +
                block.content +
                '</div>'
            break;
        }
    });
    return buf;
}