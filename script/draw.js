function draw() {
    let board = $("#blocks");
    board.empty();
    Blocks.forEach((block) => board.append(
        '<div class="' +
        'block' + ' ' +
        'block-' + block.type +
        '">' +
        block.content +
        '</div>'
    ));
}