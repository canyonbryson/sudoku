var painter;

window.onload = function () {
    painter = new Painter();
    var type = get_url_data("type");
    type = parseInt(type);
    $(".inputSudokuType").val(type);
    $(".btnScheme").bind('touchend', function() {
        painter.setScheme(this.value);
        if (this.value != 0){
            document.getElementById('text').style.color = "white";
        } else {
            document.getElementById('text').style.color = "black";
        }
    });
    $(".btnType").bind('touchend', function() {
        $(".inputSudokuType").val(this.value);
    });
    $('#overlay').bind('touchend', function() {
        if (  document.getElementById("overlay").style.display == "block") {
            document.getElementById("overlay").style.display = "none";
        }
    });
    $(".instructions").bind('touchend', function() {
        if (  document.getElementById("overlay").style.display == "none") {
            document.getElementById("overlay").style.display = "block";
        } else {document.getElementById("overlay").style.display = "none";
    }});
    
}