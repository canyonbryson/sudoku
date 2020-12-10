
window.onload = function() {
    Painter.init();
    Preferences.initHome("sudoku_type", 0);

    // $(".btnStart").bind('touchend', function() {
    //     $("#loadingContainer").css('display', 'flex');
    // });

    // if (Preferences.isRunningAndroid) {
    //     $("#divDesktop").hide();

    //     $(".btnStart").bind('touchend', function() {
    //        Preferences.set("difficulty", this.value);
    //        document.location = "game.html";
    //     });
    //     $("#btnSettings").bind('touchend', function() {
    //         document.location = "settings.html";
    //     });
    // } else {
    //     $("#divMobile").hide();
    // }
};
