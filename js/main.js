window.onload = function() {
    var slider = document.getElementById("m1");
    let difficulty = get_cookie("difficulty", 1); // does not work on local files, only on www

    var cvs = document.querySelector("#mainCanvas");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    var ctx = cvs.getContext('2d');
    var board = new Board();
    board.draw(ctx);

};
