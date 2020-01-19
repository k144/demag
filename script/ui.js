$('.tab').click(() => {
    let tabID = $('input[type=radio][name="output"]:checked').attr('id');
    console.log(tabID);
    let contentID = tabID.replace(/-tab/g, "");
    console.log(contentID);
    // TODO: ukrywanie
    $('output').hide();
    $('#' + contentID).show();
})