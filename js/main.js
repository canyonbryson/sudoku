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
    
    var button1 = document.getElementById("btnGenerate");
    button1.addEventListener("click", function() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        board = new Board(difficulty);
        board.draw(ctx);
        // console.log(board.data);
    });

    // var button2 = document.getElementById("btnSubmit");
    // button2.addEventListener("click", function() {
    //     //read the board
    //     //compare board to board.original
    // });

    // User Input?
};
