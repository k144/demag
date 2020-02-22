$('.tab').click(() => {
    let tabID = $('input[type=radio][name="output"]:checked').attr('id');
    let contentID = tabID.replace(/-tab/g, "");
    $('output').hide();
    $('#' + contentID).show();
})