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
    var board = new Board(difficulty, ctx);

    var hCell; //the highlighted cell

    window.addEventListener("click", function (e) {
        let x = e.clientX;
        let y = e.clientY;
        
        if(board.clickedBoard(x, y)){
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            board.draw(ctx);
            hCell = board.getClickedCell(x, y);
            board.highlightCell(hCell);
        } else {
            let num = board.keypad.getClickedNumber(x, y);
            if (num != -1) {
                board.updateCell(hCell, num);
                ctx.clearRect(0, 0, cvs.width, cvs.height);
                board.draw(ctx);
                board.highlightCell(hCell);
            }
        }
    });

    $("#btnSolution").click(function() {
        board.gridCurrent = board.gridSolution;
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        board.draw(ctx);
        $("#btnSolution").hide();
    });
};
