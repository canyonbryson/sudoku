
window.onload = function() {
    Painter.init();
    Preferences.initHome("sudoku_type", 0);

    $(".btnStart").bind('touchend', function() {
        $("#loadingContainer").css('display', 'flex');
    });
};
