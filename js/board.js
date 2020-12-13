class Board {
    static init(type, difficulty, ctx) {
        this.type = type; //1=knight, 2=king, 0=normal
        this.highlightCells = [0][-1, -1];
        this.highlightedCell = [-1, -1];
        this.ctx = ctx;
        this.difficulty = difficulty;
        this.data = [];
        this.cellSize = Math.floor(Math.min(this.ctx[0].canvas.width - 18, this.ctx[0].canvas.height - 18) / 9);
        this.origX = Math.floor(this.ctx[0].canvas.width / 2 - this.cellSize * 4.5);
        this.origY = 9;
        Keypad.init(this.ctx[0], this.origX, this.origY, this.cellSize);
        this.generate();
        this.draw();
        Timer.init(ctx[2]);

        this.inactive = false;
    }

    static generate() {
        this.gridNotes = [];
        for (let i = 0; i < 9; i++) { // initialize empty 9x9 grid
            this.data.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
            this.gridNotes.push([[], [], [], [], [], [], [], [], []]);
        }
        
        let cellsRemoved = 0;
        let gridParameters = { minToRemove: 36, maxToRemove: 42, maxAttempts: 50 };
        switch (this.difficulty) {           //parameters for each difficulty
            case 1:
                gridParameters = { minToRemove: 36, maxToRemove: 42, maxAttempts: 50 };
                break;
            case 2:
                gridParameters = { minToRemove: 43, maxToRemove: 49, maxAttempts: 100 };
                break;
            case 3:
                gridParameters = { minToRemove: 47, maxToRemove: 64, maxAttempts: 300 };
        }

        while (cellsRemoved < gridParameters.minToRemove) {
            console.log("start");
            this.gridSolution = this.createBoard(this.data); // recursively solve board
            let gridPrompt = { cellsRemoved: 0 }; // recursively remove numbers from board

            for (let i = 0; i < 3; i++) {
                let newPossibility = this.removeCells(this.gridSolution, gridParameters);
                console.log(newPossibility.cellsRemoved);
                if (newPossibility.cellsRemoved > gridPrompt.cellsRemoved) {
                    gridPrompt = newPossibility;
                    cellsRemoved = gridPrompt.cellsRemoved;
                }
                if (cellsRemoved >= gridParameters.minToRemove) {
                    break;
                }
            }

            this.gridPrompt = gridPrompt.data;
            this.gridCurrent = this.cloneArray(this.gridPrompt);
        }

        $("#loadingContainer").hide();
    }

    static createBoard(data) {
        return this.placeNumInGroup(1, 1, data).data;
    //     return this.fillCell(data).data; // call recursive function
    }

    static placeNumInGroup(num, group, grid) {
        if (group == 10) {
            group = 1;
            num += 1;
        }
        if (num == 10) {
            return {
                data: grid,
                result: true
            };
        }
        let tempGrid = this.cloneArray(grid);
        let emp = [];
        let r = Math.floor((group-1) / 3) * 3; //Start at row 0, 3, 6
        let c = ((group-1) % 3) * 3; //Start at col 0,3,6
        //reduce non safe cells
        emp = this.getEmptyInGroup(num, r, c, tempGrid, emp);
        while (emp.length > 0){
            let ran = this.pickCell(emp, tempGrid, num, r, c) //for harder boards and knight, we'll pick this strategically
            let cell = emp.splice(ran, 1)[0];
            tempGrid[cell[0]][cell[1]] = num;
            let result = this.placeNumInGroup(num, group + 1, tempGrid);
            if (result.result){
                return {
                    data: result.data,
                    result: true
                };
            } else {
                tempGrid[cell[0]][cell[1]] = 0;
            }
        }
        return {
            data: grid,
            result: false
        };
    }

    static pickCell(emp, grid, num, r, c){
        if (this.type == 1) {
            //if num is in c+-1 or r+-1, pick emp[c], else ran
            if (c!=0 && (grid[r][c-1] == num || grid[r+1][c-1] == num || grid[r+2][c-1] == num)){
                if (emp.includes([r+1,c])) {return emp.indexOf([r+1, c]);}
                if (emp.includes([r][c])){return emp.indexOf([r][c]);}
                if (emp.includes([r+2][c])){return emp.indexOf([r+2][c]);}
            } else if (c != 6 && (grid[r][c+3] == num || grid[r+1][c+3] == num || grid[r+2][c+3] == num)) {
                if (emp.includes([r+1,c+2])) {return emp.indexOf([r+1, c+2]);}
                if (emp.includes([r][c+2])){return emp.indexOf([r][c+2]);}
                if (emp.includes([r+2][c+2])){return emp.indexOf([r+2][c+2]);}
            } else if (r != 0 && (grid[r-1][c] == num || grid[r-1][c+1] == num || grid[r-1][c+2] == num)){
                if (emp.includes([r-1,c])) {return emp.indexOf([r-1, c]);}
                if (emp.includes([r-1][c+1])){return emp.indexOf([r-1][c+1]);}
                if (emp.includes([r-1][c+2])){return emp.indexOf([r-1][c+2]);}
            } else if (r != 6 && (grid[r+3][c] == num || grid[r+3][c+1] == num || grid[r+3][c+2] == num)) {
                if (emp.includes([r+3,c])) {return emp.indexOf([r+3, c]);}
                if (emp.includes([r+3][c+1])){return emp.indexOf([r+3][c+1]);}
                if (emp.includes([r+3][c+2])){return emp.indexOf([r+3][c+2]);}
            } else {
                return Math.floor(Math.random() * emp.length);
            }
        } else {
            return Math.floor(Math.random() * emp.length);
        }
    }
     
    static getEmptyInGroup(num, r, c, grid, emp){
        for(let j=0; j<3; j++){
            let row = [];
            let col = [];
            let col2 = [];
            let col3 = [];
            for (let i = 0; i<9; i++){
                row.push(grid[r+j][i]);
                col.push(grid[i][c]);
                col2.push(grid[i][c+1]);
                col3.push(grid[i][c+2]);
            }
            if (!row.includes(num)){ //if not in row, col, or if not a filled cell
                if(!col.includes(num) && grid[r+j][c] == 0){
                    //add row cells from emp
                    emp.push([r+j, c]);}
                if(!col2.includes(num) && grid[r+j][c+1] == 0){
                    emp.push([r+j, c+1]);}
                if(!col3.includes(num) && grid[r+j][c+2] == 0){
                    emp.push([r+j, c+2]);}
            }
        }
        if (this.type == 1) {
            return this.knight(num, grid, emp);
        } else {
            return emp;
        }
    }

    static knight(num, grid, emp){
        let list = [];
        for (let i = 0; i<emp.length; i++){
            let r = emp[i][0];
            let c = emp[i][1];
            this.check(grid, list, r + 2, c + 1);
            this.check(grid, list, r + 2, c - 1);
            this.check(grid, list, r - 2, c + 1);
            this.check(grid, list, r - 2, c - 1);
            this.check(grid, list, r + 1, c + 2);
            this.check(grid, list, r + 1, c - 2);
            this.check(grid, list, r - 1, c + 2);
            this.check(grid, list, r - 1, c - 2);
            if (list.includes(num)){
                emp.splice(i, 1);
                i--;
            }
        }
        return emp;
    }
    static check(grid, list, row, col) {
        if (row > 0 && row < grid.length) {
            list.push(grid[row][col]);
        }
    }

    static findEmptyCells(data, onlyOne) {
        let empty = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] == 0) {
                    if (onlyOne) {
                        empty = [i, j];
                        i = 10; // get out of both for loops
                        break;
                    } else {
                        empty.push([i, j]);
                    }
                }
            }
        }
        return empty;
    }

    static fillCell(data) {
        // duplicate data array
        let tempData = this.cloneArray(data);

        // find next empty cell
        // if no empty cells, return data
        let empty = this.findEmptyCells(tempData, true);
        if (empty.length == 0) { // if all cells are filled, return the result
            return {
                data: tempData,
                result: true
            };
        }

        // initalize empty safe array
        let safe = this.findSafeNumbers(tempData, empty[0], empty[1]);

        while (safe.length > 0) { // loop through all safe numbers
            let index = 0;
            let numToCheck = safe.splice(index, 1)[0];
            tempData[empty[0]][empty[1]] = numToCheck; // set found empty cell to the first safe number
            let result = this.fillCell(tempData); // recursively call to fill next cell
            if (result.result) { // if returned successfully, return the new array
                return {
                    data: result.data,
                    result: true
                };
            }
        }

        // failed to find a valid solution
        // should never get to this point
        return {
            data: tempData,
            result: false
        };

    }

    static removeCells(data, gridParameters) {
        return this.removeCell(data, gridParameters, 0, 0);
    }

    static removeCell(data, gridParameters, attempts, removed) {
        if (attempts > gridParameters.maxAttempts || removed >= gridParameters.maxToRemove) {
            return {
                data: data,
                cellsRemoved: removed
            };
        }

        let tempData = this.cloneArray(data);
        let isZero = true;
        let row = -1;
        let col = -1;
        while (isZero) { // find a random filled cell
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
            if (tempData[row][col] != 0) {
                isZero = false;
            }
        }
        tempData[row][col] = 0; // clear cell

        attempts++;
        let result = this.isNewSolution(tempData);
        if (!result.result) { // if is a unique solution
            removed++;
            return this.removeCell(tempData, gridParameters, attempts, removed);
        } else {
            return this.removeCell(data, gridParameters, attempts, removed);
        }
    }

    static isNewSolution(data) {
        let tempData = this.cloneArray(data);
        let emptyCells = this.findEmptyCells(data, false);
        if (emptyCells.length == 0) { // if all cells are filled, return the result
            return {
                data: tempData,
                result: true
            };
        }

        for (let i = 0; i < emptyCells.length; i++) {
            // fill it with every safe solution
            let empty = emptyCells[i];
            let safe = this.findSafeNumbers(tempData, empty[0], empty[1]);
            while (safe.length > 0) {
                let index = 0;
                let numToCheck = safe.splice(index, 1)[0];
                tempData[empty[0]][empty[1]] = numToCheck; // set found empty cell to the first/last safe number
                let result = this.fillCell(tempData); // recursively call to fill next cell

                //if returns same solution then good. else return { result: true }
                if (!this.compareArray(result.data, this.gridSolution)) {
                    return { result: true };
                }
            }
        }
        return { result: false };
    }

    static cloneArray(array) {
        return JSON.parse(JSON.stringify(array));
    }

    static compareArray(array1, array2) {
        return (JSON.stringify(array1) == JSON.stringify(array2));
    }

    static shuffle(array) {
        for (let i = 0; i < array.length; i++) {
            let j = Math.floor(Math.random() * i);
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    static randomizeGroup(data, group) {
        let list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.shuffle(list);
        for (let i = 0; i < 3; i++) {
            let r = Math.floor((group-1) / 3) * 3; //Start at row 0, 3, 6
            let c = ((group-1) % 3) * 3; //Start at col 0,3,6
            data[r + i][c] = list[i];
            data[r + i][c + 1] = list[i + 3];
            data[r + i][c + 2] = list[i + 6];
        }
    }

    static isValid(data) {
        const COMPLETE = [1, 1, 1, 1, 1, 1, 1, 1, 1];
        const BLANK = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < data.length; i++) { // check if all rows & columns are valid
            let row = this.cloneArray(BLANK);
            let col = this.cloneArray(BLANK);
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] != 0)
                    row[data[i][j] - 1] += 1;
                if (data[j][i] != 0)
                    col[data[j][i] - 1] += 1;
            }
            if (!this.compareArray(COMPLETE, row) || !this.compareArray(COMPLETE, col)) {
                return false;
            }
        }

        for (let i = 0; i < 3; i++) { // check if all groups are valid
            for (let j = 0; j < 3; j++) {
                let box = this.cloneArray(BLANK);
                for (let ii = 0; ii < 3; ii++) {
                    for (let jj = 0; jj < 3; jj++) {
                        box[data[i * 3 + ii][j * 3 + jj] - 1] += 1;
                    }
                }
                if (!this.compareArray(COMPLETE, box)) {
                    return false;
                }
            }
        }

        return true;
    }

    static findSafeNumbers(grid, row, col, ignore = -1) {
        let index = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        if (ignore != -1) { // ignore former content of cell
            index[ignore - 1] = 1;
        }

        let numbers = this.cloneArray(grid[row]); // get numbers in row

        for (let i = 0; i < 9; i++) { // get numbers in column
            numbers.push(grid[i][col]);
        }

        // get numbers in group
        let groupStartCol = Math.floor(col / 3) * 3;
        let groupStartRow = Math.floor(row / 3) * 3;
        for (let i = groupStartRow; i < groupStartRow + 3; i++) {
            for (let j = groupStartCol; j < groupStartCol + 3; j++) {
                numbers.push(grid[i][j]);
            }
        }

        // count numbers and save in index
        for (let i = 0; i < numbers.length; i++) {
            if (numbers[i] != 0) {
                index[numbers[i] - 1]++;
            }
        }

        // find all indices that are zero and append to safeNums array
        let safeNums = [];
        for (let i = 0; i < index.length; i++) {
            if (index[i] == 0) {
                safeNums.push(i + 1);
            }
        }
        switch (this.type) {
            case 1:
                return this.checkKnight(safeNums, grid, row, col);
            case 2:
                return this.checkKing(safeNums, grid, row, col);
            case 3:
                return this.checkDiag(safeNums, grid, row, col);
            default:
                return safeNums;
        }
    }

    static checkDiag(list, grid, row, col) {
        let del = [];
        if (row == col) { //if on the diagonal
            for (let i = 0; i < 9; i++) {
                if (list.includes(grid[i][i])) {
                    del.push(grid[i][i]);
                }
            }
            for (let i = 0; i < list.length; i++) {
                if (del.includes(list[i])){
                    list.splice(i, 1);
                    i--;
                }
            }
            if (row != 4){
                return list;
            }
        } if (row == (8 - col)) {
            for (let i = 0; i < 9; i++) {
                if (list.includes(grid[i][8 - i])) {
                    del.push(grid[i][8 - i]);
                }
            }
            for (let i = 0; i < list.length; i++) {
                if (del.includes(list[i])){
                    list.splice(i, 1);
                    i--;
                }
            }
            return list;
        } else {
            return list;
        }
    }

    static checkKnight(list, grid, row, col) {
        //if num in list violates knights, delete, then remove undefined
        //move 2 then 1
        let del = [];
        this.checkMove(grid, list, del, row + 2, col + 1);
        this.checkMove(grid, list, del, row + 2, col - 1);
        this.checkMove(grid, list, del, row - 2, col + 1);
        this.checkMove(grid, list, del, row - 2, col - 1);
        this.checkMove(grid, list, del, row + 1, col + 2);
        this.checkMove(grid, list, del, row + 1, col - 2);
        this.checkMove(grid, list, del, row - 1, col + 2);
        this.checkMove(grid, list, del, row - 1, col - 2);
        for (let i = 0; i < list.length; i++) {
            if (del.includes(list[i])){
                list.splice(i, 1);
                i--;
            }
        }
        return list;
    }

    static checkMove(grid, list, del, row, col) {
        if (row > 0 && row < grid.length) {
            if (list.includes(grid[row][col])) {
                del.push(grid[row][col]);
            }
        }
    }

    static checkKing(list, grid, row, col) {
        //if num in list violates Kings, delete and remove
        //move 1 out
        let del = [];
        this.checkMove(grid, list, del, row, col + 1);
        this.checkMove(grid, list, del, row, col - 1);
        this.checkMove(grid, list, del, row - 1, col + 1);
        this.checkMove(grid, list, del, row - 1, col - 1);
        this.checkMove(grid, list, del, row - 1, col);
        this.checkMove(grid, list, del, row + 1, col + 1);
        this.checkMove(grid, list, del, row + 1, col - 1);
        this.checkMove(grid, list, del, row + 1, col);
        for (let i = 0; i < list.length; i++) {
            if (del.includes(list[i])){
                list.splice(i, 1);
                i--;
            }
        }
        return list;
    }

    static draw() {
        this.ctx[0].clearRect(0, 0, this.ctx[0].canvas.width, this.ctx[0].canvas.height);
        Painter.set_font(this.ctx[0], this.cellSize);

        for (let i = 0; i < this.gridCurrent.length; i++) {
            for (let j = 0; j < this.gridCurrent[i].length; j++) {
                if (this.gridCurrent[j][i] != 0) {
                    if (this.gridPrompt[j][i] != 0) {
                        this.ctx[0].fillStyle = Painter.colorSchemes[Painter.currentScheme].accent; //"rgba(0,0,0,0.2)";
                        this.ctx[0].fillRect(this.origX + this.cellSize * i, this.origY + this.cellSize * j, this.cellSize, this.cellSize);
                    } if(this.gridCurrent[j][i] != this.gridSolution[j][i]){
                        Painter.draw_text(this.ctx[0], this.gridCurrent[j][i], this.origX + this.cellSize * i + this.cellSize * 0.5, this.origY + this.cellSize * j + this.cellSize * 0.5, true);}
                        else {
                    Painter.draw_text(this.ctx[0], this.gridCurrent[j][i], this.origX + this.cellSize * i + this.cellSize * 0.5, this.origY + this.cellSize * j + this.cellSize * 0.5);}
                } else if (this.gridNotes[j][i].length != 0) {
                    Painter.set_font_small(this.ctx[0], this.cellSize);
                    for (let k = 0; k < this.gridNotes[j][i].length; k++) {
                        let col = (this.gridNotes[j][i][k] - 1) % 3 + 0.4;
                        let row = (this.gridNotes[j][i][k] - col - 1) / 3 + 0.1;
                        Painter.draw_text(this.ctx[0], this.gridNotes[j][i][k], this.origX + this.cellSize * i + (col * this.cellSize * 0.3), this.origY + this.cellSize * j + (row * this.cellSize * 0.3));
                    }
                    Painter.set_font(this.ctx[0], this.cellSize);
                }   
            }
        }
        for (let i = 0; i < 10; i++) {
            Painter.line(this.ctx[0], this.origX + this.cellSize * i, this.origY, this.origX + this.cellSize * i, this.origY + this.cellSize * 9, i);
        }
        for (let j = 0; j < 10; j++) {
            Painter.line(this.ctx[0], this.origX, this.origY + this.cellSize * j, this.origX + this.cellSize * 9, this.origY + this.cellSize * j, j);
        }
        if (this.type == 3){
            Painter.line(this.ctx[0], this.origX, this.origY, this.origX + this.cellSize*9, this.origY+this.cellSize*9, 10);
            Painter.line(this.ctx[0], this.origX  + this.cellSize*9, this.origY, this.origX, this.origY+this.cellSize*9, 10);
        }
        // this.setCells(this.gridCurrent, this.origX, this.origY, this.cellSize);
        Keypad.draw(this.ctx[0]);
    }

    static clickedBoard(x, y) {
        let xx = x - this.origX;
        let yy = y - this.origY;
        return (xx >= 0 && xx <= this.cellSize * 9) && (yy >= 0 && yy <= this.cellSize * 9);
    }

    static getClickedCell(x, y) {
        // returns the cell with x, y coords
        x -= this.origX;
        y -= this.origY;
        let col = Math.floor(x / this.cellSize);
        let row = Math.floor(y / this.cellSize);
        return [col, row];
    }

    static highlightCell(cellCoords, outline = true) {
        if (outline) {
            this.highlightedCell = cellCoords;
        }

        if (cellCoords[0] != -1) {
            let cell_x = this.origX + cellCoords[0] * this.cellSize;
            let cell_y = this.origY + cellCoords[1] * this.cellSize;

            let drawGradient = !outline;
            if (outline) {
                this.draw(); // clear canvas and redraw board if selecting new cell
                Painter.line(this.ctx[0], cell_x, cell_y, cell_x + this.cellSize, cell_y, -1);
                Painter.line(this.ctx[0], cell_x, cell_y, cell_x, cell_y + this.cellSize, -1);
                Painter.line(this.ctx[0], cell_x + this.cellSize, cell_y, cell_x + this.cellSize, cell_y + this.cellSize, -1);
                Painter.line(this.ctx[0], cell_x, cell_y + this.cellSize, cell_x + this.cellSize, cell_y + this.cellSize, -1);
                if (this.gridCurrent[cellCoords[1]][cellCoords[0]] != 0) {
                    this.highlightAllOfNumber(this.gridCurrent[cellCoords[1]][cellCoords[0]]);
                } else {
                    drawGradient = true;
                }
            }
            if (drawGradient) {
                var grd = this.ctx[0].createRadialGradient(cell_x + this.cellSize / 2, cell_y + this.cellSize / 2, 10, cell_x + this.cellSize / 2, cell_y + this.cellSize / 2, this.cellSize);
                grd.addColorStop(0, Painter.highlightGradient[0]);
                grd.addColorStop(1, Painter.highlightGradient[1]);
                this.ctx[0].fillStyle = grd;
                this.ctx[0].fillRect(cell_x, cell_y, this.cellSize, this.cellSize);
            }
        } else {
            this.draw(); // clear canvas and redraw board if selecting new cell
        }
    }

    static highlightAllOfNumber(num) {
        for (let i = 0; i < this.gridCurrent.length; i++) {
            for (let j = 0; j < this.gridCurrent.length; j++) {
                if (this.gridCurrent[i][j] == num) {
                    this.highlightCell([j, i], false);
                }
            }
        }
    }

    static isFull(data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].includes(0)) {
                return false;
            }
        }
        return true;
    }

    static updateCell(num) {
        if (!this.compareArray(this.highlightedCell, [-1, -1])) { // if there is a cell selected
            if (this.gridPrompt[this.highlightedCell[1]][this.highlightedCell[0]] == 0) {
                //updates a cell with the desired number
                if (num == 0 && this.gridCurrent[this.highlightedCell[1]][this.highlightedCell[0]] == 0) {
                    // if clearing, clear the notes only if the cell is currently empty
                    this.gridNotes[this.highlightedCell[1]][this.highlightedCell[0]] = [];
                }
                this.gridCurrent[this.highlightedCell[1]][this.highlightedCell[0]] = num;
                this.highlightCell(this.highlightedCell);
            }
            this.checkComplete();
        }
    }

    static updateNote(num) {
        if (!this.compareArray(this.highlightedCell, [-1, -1])) { // if there is a cell selected
            if (this.gridPrompt[this.highlightedCell[1]][this.highlightedCell[0]] == 0 && this.gridCurrent[this.highlightedCell[1]][this.highlightedCell[0]] == 0) {
                //updates a cell with the desired number
                this.gridNotes[this.highlightedCell[1]][this.highlightedCell[0]].push(num);
                this.gridNotes[this.highlightedCell[1]][this.highlightedCell[0]] = this.removeNoteDuplicates(this.gridNotes[this.highlightedCell[1]][this.highlightedCell[0]]);
                // this.highlightCell([-1, -1]);
                this.highlightCell(this.highlightedCell);
                this.highlightAllOfNumber(num);
            }
        }
    }

    static checkComplete() {
        if (this.isFull(this.gridCurrent)) {
            Timer.stop();
            this.inactive = true;
            if (this.isValid(this.gridCurrent)) {
                // won!
                Message.show(this.ctx[2], "won");
            } else {
                // bad
                Message.show(this.ctx[2], "incorrect");
            }
        }
    }

    static clearMessage() {
        this.ctx[2].clearRect(0, 0, this.ctx[2].canvas.width, this.ctx[2].canvas.height);
        Timer.start();
        this.inactive = false;
    }

    static removeNoteDuplicates(array) {
        let idx = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        let newArray = [];
        for (let i = 0; i < array.length; i++) {
            if (idx[array[i] - 1] == 0) {
                idx[array[i] - 1] = 1;
                newArray.push(array[i]);
            }
        }
        return newArray;
    }
}

