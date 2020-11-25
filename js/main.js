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
    var cvs = document.querySelector("#mainCanvas");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    var ctx = cvs.getContext('2d');
    var board = new Board(difficulty);
    board.draw(ctx);

    document.querySelector("#btnSolution").addEventListener("click", function() {
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
