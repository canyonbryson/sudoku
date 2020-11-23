window.onload = function() {

    var slider = document.getElementById("m1");
    let difficulty = parseInt(slider.value);
    slider.oninput = function() {
        difficulty = parseInt(slider.value);
        // ctx.clearRect(0, 0, width, height);
        var board = new Board(difficulty);
        board.draw(ctx);
        console.log(board.data);
    }

    var cvs = document.querySelector("#mainCanvas");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    var ctx = cvs.getContext('2d');
    var board = new Board(difficulty);
    board.draw(ctx);
    console.log(board.data);

    

};
