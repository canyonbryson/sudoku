
class Board {
    constructor(difficulty) {
        this.data = [];
        this.original;
        this.difficulty = difficulty;
        this.attempts = 0;
        this.generate();
    }

    generate(){
        for (let i = 0; i < 9; i++){
            this.data.push([0,0,0,0,0,0,0,0,0]);
        }

        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (let i = 1; i < 10; i += 4) { // create & randomize groups 1, 5, and 9
            this.shuffle(nums);
            this.addToGroup(this.data, nums, i);
        }

        this.data = this.backtrack(this.data); // recursively solve board
        this.original = this.clone_array(this.data);
        this.data = this.remove_cell(this.data); // recursively remove numbers from board
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
                 if (!this.compare_array(result.data, this.original)) {                                
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

    draw(ctx) {
        let cellSize = Math.floor(Math.min(ctx.canvas.width - 18, ctx.canvas.height - 18) / 9);
        let origX = Math.floor(ctx.canvas.width / 2 - cellSize * 4.5);
        let origY = 9;
        for (let i = 0; i < 10; i++) {
            line(ctx, origX + cellSize * i, origY, origX + cellSize * i, origY + cellSize * 9, i);
        }
        for (let j = 0; j < 10; j++) {
            line(ctx, origX, origY + cellSize * j, origX + cellSize * 9, origY + cellSize * j, j);
        }
        set_font(ctx, cellSize);
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                if (this.data[j][i] != 0) {
                    draw_text(ctx, this.data[j][i], origX + cellSize * i + cellSize * 0.5, origY + cellSize * j + cellSize * 0.5);
                }
            }
        }
    }

}

