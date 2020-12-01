
class Board {
    constructor(difficulty, ctx) {
        this.ctx = ctx;
        this.difficulty = difficulty;
        this.attempts = 0;
        this.data = [];
        this.cellSize = Math.floor(Math.min(this.ctx.canvas.width - 18, this.ctx.canvas.height - 18) / 9);
        this.origX = Math.floor(this.ctx.canvas.width / 2 - this.cellSize * 4.5);
        this.origY = 9;
        this.keypad = new Keypad(this.origX, this.origY, this.cellSize);
        this.generate();
        this.draw();
    }

    generate() {
        for (let i = 0; i < 9; i++){
            this.data.push([0,0,0,0,0,0,0,0,0]);
        }

        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (let i = 1; i < 10; i += 4) { // create & randomize groups 1, 5, and 9
            this.shuffle(nums);
            this.addToGroup(this.data, nums, i);
        }

        this.gridSolution = this.backtrack(this.data); // recursively solve board
        this.gridPrompt = this.remove_cell(this.clone_array(this.gridSolution)); // recursively remove numbers from board
        this.gridCurrent = this.clone_array(this.gridPrompt);
    }

    backtrack(data){
        return this.pick_next_cell(data).data; // call recursive function
    }

    pick_next_cell(data) {
        // duplicate data array
        let tempData = this.clone_array(data);

        // find next empty cell
        // if no empty cells, return data
        let empty = [-1, -1];
        for (let i = 0; i < tempData.length; i++) {
            for (let j = 0; j < tempData[i].length; j++) {
                if (tempData[i][j] == 0) {
                    empty = [i, j];
                    i = 10; // get out of both for loops
                    break;
                }
            }
        }
        if (empty[0] == -1 && empty[1] == -1) { // if all cells are filled, return the result
            return {
                data: tempData,
                result: true
            };
        }

        // initalize empty safe array
        let safe = this.find_safe_numbers(tempData, empty[0], empty[1]);
        
        while (safe.length > 0) { // loop through all safe numbers
            let index = 0;
            let numToCheck = safe.splice(index, 1)[0];
            tempData[empty[0]][empty[1]] = numToCheck; // set found empty cell to the first/last safe number
            let result = this.pick_next_cell(tempData); // recursively call to fill next cell
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

    remove_cell(data) {
        let tempData = this.clone_array(data);
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

        this.attempts += 1;
        let result = this.isNewSolution(tempData);
        if (!result.result) { // if no new solution
            return this.remove_cell(tempData);
        } else if(this.attempts < this.difficulty) {
            return this.remove_cell(data);
        }
        else {
            return data;
        }
    }

    isNewSolution(data) {
        let tempData = this.clone_array(data);
        let emptyCells = [];
        for (let i = 0; i < tempData.length; i++) {
            for (let j = 0; j < tempData[i].length; j++) {
                if (tempData[i][j] == 0) {
                    emptyCells.push([i, j]);
                }
            }
        }
        if (emptyCells.length == 0) {                                  // if all cells are filled, return the result
            return {
                data: tempData,
                result: true
            };
        }
        for(let i = 0; i < emptyCells.length; i++){
                                                                       //fill it with every safe solution
            let empty = emptyCells[i];
            let safe = this.find_safe_numbers(tempData, empty[0], empty[1]);
            let result;
            while (safe.length > 0) {
                let index = 0;
                let numToCheck = safe.splice(index, 1)[0];
                tempData[empty[0]][empty[1]] = numToCheck;              // set found empty cell to the first/last safe number
                result = this.pick_next_cell(tempData);                 // recursively call to fill next cell
    
                //if returns same solution then good. else return {result: true}
                 if (!this.compare_array(result.data, this.gridSolution)) {                                
                     return {
                        result: true
                    };
                }                                                      
            }
        }
        return {
            result: false
        };
        
    }

    clone_array(array) {
        let newArray = [];
        for (let i = 0; i < array.length; i++) {
            newArray.push([]);
            for (let j = 0; j < array.length; j++) {
                newArray[i].push(array[i][j]);
            }
        }
        return newArray;
    }

    compare_array(array1, array2) {
        return (JSON.stringify(array1) == JSON.stringify(array2));
    }

    shuffle(array) {
        for(let i = array.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
          }
    }

    addToGroup(data, list, group) {
        for (let i = 0; i < 3; i++){
            let g = Math.floor((group - 1)/3) * 3; //Start at row 0, 3, 6
            data[g + i][g] = list[i];
            data[g + i][g + 1] = list[i+3];
            data[g + i][g + 2] = list[i+6];
        }
    }

    valid(data){
        for (let i = 0; i < data.length; i++) { // check if all rows & columns are valid
            let row = [0,0,0,0,0,0,0,0,0];
            let col = [0,0,0,0,0,0,0,0,0];
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] != 0)
                    row[data[i][j] - 1] += 1;
                if (data[j][i] != 0)
                    col[data[j][i] - 1] += 1;
            }
            if (row.includes(2) || col.includes(2)){
                return false;
            }
        }

        for (let i = 0; i < 3; i++) { // check if all groups are valid
            for (let j = 0; j < 3; j++) {
                let box = [0,0,0,0,0,0,0,0,0];
                for (let ii = 0; ii < 3; ii++) {
                    for (let jj = 0; jj < 3; jj++) {
                        box[data[i*3 + ii][j*3 + jj] - 1] += 1;
                    }
                }
                if (box.includes(2) || box.includes(3)) {
                    return false;
                }
            }
        }

        return true;
    }

    clone_array_1d(array) {
        let newArray = [];
        for (let i = 0; i < array.length; i++) {
            newArray.push(array[i]);
        }
        return newArray;
    }
    
    find_safe_numbers(grid, row, col, ignore = -1) {
        let index = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        if (ignore != -1) { // ignore former content of cell
            index[ignore - 1] = 1;
        }

        let numbers = this.clone_array_1d(grid[row]); // get numbers in row

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
        return safeNums;
    }

    draw() {
        for (let i = 0; i < 10; i++) {
            line(this.ctx, this.origX + this.cellSize * i, this.origY, this.origX + this.cellSize * i, this.origY + this.cellSize * 9, i);
        }
        for (let j = 0; j < 10; j++) {
            line(this.ctx, this.origX, this.origY + this.cellSize * j, this.origX + this.cellSize * 9, this.origY + this.cellSize * j, j);
        }
        set_font(this.ctx, this.cellSize);
        for (let i = 0; i < this.gridCurrent.length; i++) {
            for (let j = 0; j < this.gridCurrent[i].length; j++) {
                if (this.gridCurrent[j][i] != 0) {
                    if (this.gridPrompt[j][i] != 0) {
                        this.ctx.fillStyle = "rgba(0,0,0,0.2)";
                        this.ctx.fillRect(this.origX + this.cellSize * i, this.origY + this.cellSize * j, this.cellSize, this.cellSize);
                    }
                    this.ctx.fillStyle = "black";
                    draw_text(this.ctx, this.gridCurrent[j][i], this.origX + this.cellSize * i + this.cellSize * 0.5, this.origY + this.cellSize * j + this.cellSize * 0.5);
                }
            }
        }
        // this.setCells(this.gridCurrent, this.origX, this.origY, this.cellSize);
        this.keypad.draw(this.ctx);
    }

    clickedBoard(x, y) {
        let xx = x - this.origX;
        let yy = y - this.origY;
        return (xx >= 0 && xx <= this.cellSize * 9) && (yy >= 0 && yy <= this.cellSize * 9);
    }

    getClickedCell(x, y) {
        // returns the cell with x, y coords
        x -= this.origX;
        y -= this.origY; // 42 = size of "home page" button that moves canvas down
        let col = Math.floor(x / this.cellSize);
        let row = Math.floor(y / this.cellSize);
        return [col, row];
    }

    highlightCell(cellCoords, outline=true) {
        //highlights a selected cell
        let cell_x = this.origX + cellCoords[0] * this.cellSize;
        let cell_y = this.origY + cellCoords[1] * this.cellSize;

        let drawGradient = !outline;
        if (outline) {
            line(this.ctx, cell_x, cell_y, cell_x + this.cellSize, cell_y, -1);
            line(this.ctx, cell_x, cell_y, cell_x, cell_y + this.cellSize, -1);
            line(this.ctx, cell_x + this.cellSize, cell_y, cell_x + this.cellSize, cell_y + this.cellSize, -1);
            line(this.ctx, cell_x, cell_y + this.cellSize, cell_x + this.cellSize, cell_y + this.cellSize, -1);
            if (this.gridCurrent[cellCoords[1]][cellCoords[0]] != 0) {
                this.highlightAllOfNumber(this.gridCurrent[cellCoords[1]][cellCoords[0]]);
            } else {
                drawGradient = true;
            }
        }
        if (drawGradient) {
            // gradient fill
            var grd = this.ctx.createRadialGradient(cell_x + this.cellSize / 2, cell_y + this.cellSize / 2, 10, cell_x + this.cellSize / 2, cell_y + this.cellSize / 2, this.cellSize);
            grd.addColorStop(0,"rgba(0,62,214,0.09)");
            grd.addColorStop(1,"rgba(0,151,255,0.8)");
            this.ctx.fillStyle = grd;
            this.ctx.fillRect(cell_x, cell_y, this.cellSize, this.cellSize);
        }
    }

    highlightAllOfNumber(num) {
        for (let i = 0; i < this.gridCurrent.length; i++) {
            for (let j = 0; j < this.gridCurrent.length; j++) {
                if (this.gridCurrent[i][j] == num) {
                    this.highlightCell([j, i], false);
                }
            }
        }
    }

    updateCell(cell, num) {
        if (this.gridPrompt[cell[1]][cell[0]] == 0) {
            //updates a cell with the desired number
            this.gridCurrent[cell[1]][cell[0]] = num;
            let cell_x = this.origX + cell[0] * this.cellSize;
            let cell_y = this.origY + cell[1] * this.cellSize;
            draw_text(this.ctx, num, cell_x + this.cellSize * 0.5, cell_y + this.cellSize * 0.5);
        }
    }


}

