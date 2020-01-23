function put(content) {
    let board = $("#blocks");
    board.empty();
    board.append(content);
}

function draw(blocks) {
    let buf = new Array()
    blocks.forEach((block) => buf.push(
        '<div class="' +
        'block' + ' ' +
        'block-' + block.type +
        '">' +
        block.content +
        '</div>'
    ));
    return buf
}