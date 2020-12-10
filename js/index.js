var painter;

window.onload = function() {
    painter = new Painter();
    var type = get_url_data("type");
    type = parseInt(type);
    $(".inputSudokuType").val(type);
};
