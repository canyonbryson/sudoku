window.onload = function () {
    Painter.init();
    Preferences.init("color_scheme", 0);
    Preferences.init("sudoku_type", 0);

    var cvs = [document.querySelector("#cvsMain"), document.querySelector("#cvsFireworks"), document.querySelector("#cvsMsg")];
    var ctx = initializeContexts(cvs);

    Board.init(Preferences.get("sudoku_type", 0), Preferences.get("difficulty", 1), ctx);

    Egg.init(ctx[2]);

    $(document).bind('touchstart', function (e) {
        if (!Board.inactive) { // if there is no message open
            let x = e.touches[0].clientX;
            let y = e.touches[0].clientY;

            if (Board.clickedBoard(x, y)) {
                let newCell = Board.getClickedCell(x, y);
                if (Board.compareArray(newCell, Board.highlightedCell)) {
                    Board.highlightCell([-1, -1]); // clear cell if clicking currently highlighted cell
                } else {
                    Board.highlightCell(newCell); // highlight recently clicked cell

                    let selectedKey = Keypad.selectedKey;

                    if (selectedKey >= 0 && selectedKey <= 8) { // if a number is selected, update the number or the note
                        if (!Keypad.selectedNote) { // if note is not selected, update cell value
                            Board.updateCell(Keypad.selectedKey + 1);
                        } else { // otherwise, update note
                            Board.updateNote(Keypad.selectedKey + 1);
                        }
                    } else {
                        if (Keypad.selectedNote) { // if note is selected but no number, deselect note when clicking a cell
                            // Keypad.selectKey(9);
                        }
                        if (selectedKey == 10) { // clear
                            Board.updateCell(0);
                        }
                    }
                }
            } else { // clicked keypad
                let isNothingHighlighted = Board.compareArray(Board.highlightedCell, [-1, -1]);
                let num = Keypad.getClickedNumber(x, y, isNothingHighlighted);
                if (!isNothingHighlighted && num == 0 && Board.gridCurrent[Board.highlightedCell[1]][Board.highlightedCell[0]] == 0 && Board.gridNotes[Board.highlightedCell[1]][Board.highlightedCell[0]].length == 0) {
                    // if clearing a cell but it's already blank, hold down clear
                    Keypad.selectKey(10);
                }
                if (num != -1) {
                    if (num == 0) { // if selecting clear, deselect the note button and any numbers
                        Keypad.selectedNote = false;
                        Keypad.selectKey(-1);
                    }
                    if (!Keypad.selectedNote) { // update the cell or the note
                        Board.updateCell(num);
                    } else {
                        Board.updateNote(num);
                    }
                } else {
                    if (x < 80 && y > window.innerHeight - 50) {
                        Egg.increment();
                    }
                }
            }
        }
    });
};

function initializeContexts(cvs) {
    let ctx = [];
    for (let i = 0; i < cvs.length; i++) { // initialize canvases & contexts
        cvs[i].width = window.innerWidth;
        cvs[i].height = window.innerHeight;
        ctx.push(cvs[i].getContext('2d'));
    }
    return ctx;
}