window.onload = function() {

    var cvs = document.querySelector("#mainCanvas");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    var ctx = cvs.getContext('2d');
    var board = new Board();
    board.draw(ctx);
    console.log(board.data);

};
