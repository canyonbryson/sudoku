var board;

window.onload = function() {
    function getQueryString() {
        var result = {}, queryString = location.search.slice(1),
            re = /([^&=]+)=([^&]*)/g, m;
        while (m = re.exec(queryString)) {
          result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return result;
    }
      
    var difficulty = getQueryString()["difficulty"];
    $("#btnHome").val(difficulty);
    var cvs = [document.querySelector("#cvsMain"), document.querySelector("#cvsFireworks"), document.querySelector("#cvsMsg")];
    var ctx = [];
    for (let i = 0; i < cvs.length; i++) {
        cvs[i].width = window.innerWidth;
        cvs[i].height = window.innerHeight;
        ctx.push(cvs[i].getContext('2d'));
    }
    board = new Board(difficulty, ctx);

    $(document).bind('touchstart', function (e) {
        if (!board.inactive) {
            let x = e.touches[0].clientX;
            let y = e.touches[0].clientY;
            
            if(board.clickedBoard(x, y)) {
                let newCell = board.getClickedCell(x, y);
                if (newCell[0] == board.highlightedCell[0] && newCell[1] == board.highlightedCell[1]) {
                    board.highlightCell([-1, -1]); // clear cell if clicking currently highlighted cell
                } else {
                    board.highlightCell(newCell); // highlight recently clicked cell
    
                    let selectedKey = board.keypad.selectedKey;
    
                    if (selectedKey >= 0 && selectedKey <= 8) { // if a number is selected, update the number or the note
                        if (!board.keypad.selectedNote) { // if note is not selected, update cell value
                            board.updateCell(board.keypad.selectedKey + 1);
                        } else { // otherwise, update note
                            board.updateNote(board.keypad.selectedKey + 1);
                            // board.highlightCell([-1, -1]);
                            // board.highlightAllOfNumber(board.keypad.selectedKey + 1);
                        }
                    } else {
                        if (board.keypad.selectedNote) { // if note is selected but no number, deselect note when clicking a cell
                            board.keypad.selectKey(9);
                        }
                        if (selectedKey == 10) { // clear
                            board.updateCell(0);
                        } else if (selectedKey == 9) { // note
                            // board.updateNotes(board.keypad.selectedKey + 1);
                        }
                    }
                }
            } else { // clicked keypad
                let isNothingHighlighted = board.compareArray(board.highlightedCell, [-1,-1]);
                let num = board.keypad.getClickedNumber(x, y, isNothingHighlighted);
                if (!isNothingHighlighted && num == 0 && board.gridCurrent[board.highlightedCell[1]][board.highlightedCell[0]] == 0 && board.gridNotes[board.highlightedCell[1]][board.highlightedCell[0]].length == 0) {
                    // if clearing a cell but it's already blank, hold down clear
                    board.keypad.selectKey(10);
                }
                if (num != -1) {
                    if (num == 0) {
                        board.keypad.selectedNote = false;
                        board.keypad.selectKey(-1);
                    }
                    if (!board.keypad.selectedNote) {
                        board.updateCell(num);
                    } else {
                        board.updateNote(num);
                        board.highlightCell(board.highlightedCell);
                    }
                }
            }
        }
    });

    $("#btnSolution").click(function() {
        board.gridCurrent = board.gridSolution;
        ctx[0].clearRect(0, 0, cvs[0].width, cvs[0].height);
        board.draw();
        $("#btnSolution").hide();
    });
};
