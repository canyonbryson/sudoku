window.onload = function() {
    $("#btnGenerate").click(function() {
        set_cookie("difficulty", parseInt($("#m1").value), 2);
        document.location = "game.html";
    });
};