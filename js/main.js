window.onload = function() {
    function getQueryString() {
        var result = {}, queryString = location.search.slice(1),
            re = /([^&=]+)=([^&]*)/g, m;
        while (m = re.exec(queryString)) {
          result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return result;
    }
      
    var difficulty = getQueryString()["difficulty"];    // let difficulty = get_cookie("difficulty", 1); // does not work on local files, only on www
    $("#btnHome").val(difficulty);
    var cvs = document.querySelector("#mainCanvas");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    var ctx = cvs.getContext('2d');
    var board = new Board(difficulty);
    board.draw(ctx);

    var hCell; //the highlighted cell

    window.addEventListener("click", function (e) {
        let x = e.clientX;
        let y = e.clientY;
        if(board.onBoard(x, y)){
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            board.draw(ctx);
            hCell = board.getCell(x, y);
            board.highlightCell(hCell, ctx);
        }
        else if (board.onNumbers(x, y)){
            let num = board.getNumber(x, y);
            board.updateCell(hCell, num, ctx);
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            board.draw(ctx);
            board.highlightCell(hCell, ctx);
        }
    });

    $("#btnSolution").click(function() {
        board.data = board.original;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        board.draw(ctx);
        $("#btnSolution").toggle();
    });

    // var button2 = document.getElementById("btnSubmit");
    // button2.addEventListener("click", function() {
    //     //read the board
    //     //compare board to board.original
    // });

    // User Input?
};
