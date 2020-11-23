window.onload = function() {
    var slider = document.getElementById("m1");
    let difficulty = parseInt(slider.value);

    var cvs = document.querySelector("#mainCanvas");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    var ctx = cvs.getContext('2d');
    var board = new Board(difficulty);
    board.draw(ctx);
    console.log(board.data);
    
    slider.oninput = function() {
        difficulty = parseInt(slider.value);
    };
    
    var button = document.getElementById("btnGenerate");
    button.addEventListener("click", function() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        board = new Board(difficulty);
        board.draw(ctx);
        $("#btnSolution").show();
    });

    document.querySelector("#btnSolution").addEventListener("click", function() {
        board.data = board.original;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        board.draw(ctx);
        $("#btnSolution").toggle();
    });
};
