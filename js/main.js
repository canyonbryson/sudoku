window.onload = function() {

    var cvs = document.querySelector("#mainCanvas");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    var ctx = cvs.getContext('2d');
    var board = new Board();
    board.draw(ctx);

    var solver = new Solver(board);
    console.log(solver.solve(board.data));

};
