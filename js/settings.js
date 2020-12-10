window.onload = function () {
    Painter.init();
    Preferences.init("color_scheme", 0);
    Preferences.init("sudoku_type", 0); // load sudoku_type preferences into input dropdown

    $(".btn_color_scheme").bind('touchend', function() {
        Painter.setScheme(this.value);
        Preferences.set("color_scheme", this.value);
    });

    $(".btn_sudoku_type").bind('touchend', function() {
        Preferences.set("sudoku_type", this.value);
    });

    $('#instructionsOverlay').bind('touchend', function(e) {
        $("#instructionsOverlay").hide();
        e.preventDefault(); // prevents other buttons from being pushed while closing instructions
    });

    $("#btnInstructions").bind('touchend', function() {
        $("#instructionsOverlay").show();
    });
    
}