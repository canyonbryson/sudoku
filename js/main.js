var board;
var painter;

window.onload = function () {
    painter = new Painter();
    var difficulty = get_url_data("difficulty");
    var cvs = [document.querySelector("#cvsMain"), document.querySelector("#cvsFireworks"), document.querySelector("#cvsMsg")];
    var ctx = initializeContexts(cvs);
    board = new Board(difficulty, ctx);
    var egg = new Egg(ctx[2]);

    $(document).bind('touchstart', function (e) {
        if (!board.inactive) { // if there is no message open
            let x = e.touches[0].clientX;
            let y = e.touches[0].clientY;

            if (board.clickedBoard(x, y)) {
                let newCell = board.getClickedCell(x, y);
                if (board.compareArray(newCell, board.highlightedCell)) {
                    board.highlightCell([-1, -1]); // clear cell if clicking currently highlighted cell
                } else {
                    board.highlightCell(newCell); // highlight recently clicked cell

                    let selectedKey = board.keypad.selectedKey;

                    if (selectedKey >= 0 && selectedKey <= 8) { // if a number is selected, update the number or the note
                        if (!board.keypad.selectedNote) { // if note is not selected, update cell value
                            board.updateCell(board.keypad.selectedKey + 1);
                        } else { // otherwise, update note
                            board.updateNote(board.keypad.selectedKey + 1);
                        }
                    } else {
                        if (board.keypad.selectedNote) { // if note is selected but no number, deselect note when clicking a cell
                            // board.keypad.selectKey(9);
                        }
                        if (selectedKey == 10) { // clear
                            board.updateCell(0);
                        }
                    }
                }
            } else { // clicked keypad
                let isNothingHighlighted = board.compareArray(board.highlightedCell, [-1, -1]);
                let num = board.keypad.getClickedNumber(x, y, isNothingHighlighted);
                if (!isNothingHighlighted && num == 0 && board.gridCurrent[board.highlightedCell[1]][board.highlightedCell[0]] == 0 && board.gridNotes[board.highlightedCell[1]][board.highlightedCell[0]].length == 0) {
                    // if clearing a cell but it's already blank, hold down clear
                    board.keypad.selectKey(10);
                }
                if (num != -1) {
                    if (num == 0) { // if selecting clear, deselect the note button and any numbers
                        board.keypad.selectedNote = false;
                        board.keypad.selectKey(-1);
                    }
                    if (!board.keypad.selectedNote) { // update the cell or the note
                        board.updateCell(num);
                    } else {
                        board.updateNote(num);
                    }
                } else {
                    if (x < 80 && y > window.innerHeight - 50) {
                        egg.increment();
                    }
                }
            }
        }
    });

    $(document).bind('touchmove', function(e) {

    });

    $(document).bind('touchend', function(e) {

    });

    $("#btnHome").bind('touchend', function() {
        document.location = 'index.html';
    });
};