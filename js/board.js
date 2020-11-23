var attempts = 0;
var max_count = 100;
var max_attempts = 1500;

class Board {
    constructor() {
        this.data = [];
        this.generate();
    }

    isFull(grid) {
        for (let i = 0; i < 81; i++) {
            let col = i % 9;
            let row = (i - col) / 9;
            if (grid[row][col] == 0) {
                return false;
            }
        }
        return true;
    }

    generate() {
        for (let i = 0; i < 9; i++) {
            this.data.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }

        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (let i = 1; i < 10; i += 4) { // create & randomize groups 1, 5, and 9
            this.shuffle(nums);
            this.addToGroup(this.data, nums, i);
        }

        this.data = this.backtrack(this.data); // recursively solve board
        this.data = this.remove_cells(this.data); // recursively remove numbers from board
        console.log(attempts);
    }

    backtrack(data) {
        return this.pick_next_cell(data, true).data; // call recursive function
    }

    find_empty_cell(data) {
        let empty = [-1, -1];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] == 0) {
                    empty = [i, j];
                    i = 10; // get out of both for loops
                    break;
                }
            }
        }
        return empty;
    }

    pick_next_cell(data) {
        // duplicate data array
        let tempData = this.clone_array(data);

        let empty = this.find_empty_cell(tempData);
        if (this.compare_array(empty, [-1, -1])) { // if all cells are filled, return the result
            return {
                data: data,
                result: true
            };
        }

        // find safe numbers
        let safe = this.find_safe_numbers(tempData, empty[0], empty[1]);

        while (safe.length > 0) { // loop through all safe numbers
            let index = Math.floor(Math.random() * safe.length);
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

    random_filled_cell(data) {
        let isZero = true;
        let row = -1;
        let col = -1;
        while (isZero) {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
            if (data[row][col] != 0) {
                isZero = false;
            }
        }
        return [row, col];
    }

    check_unique_solution(data, starting_cell) {
        attempts++;
        // duplicate data array
        let tempData = this.clone_array(data);

        let empty = this.find_empty_cell(tempData);
        if (this.compare_array(empty, [-1, -1])) { // if all cells are filled, return the result
            return {
                data: tempData,
                unique: false
            };
        }

        // if (starting_cell.ignore == -1) { // if no ignore argument passed in, use first empty cell instead of starting cell
        //     starting_cell.row = empty[0];
        //     starting_cell.col = empty[1];
        // }

        // find safe numbers
        let safe = [];
        if (starting_cell.row == empty[0] && starting_cell.col == empty[1]) {
            safe = this.find_safe_numbers(tempData, starting_cell.row, starting_cell.col, starting_cell.ignore);
        } else {
            safe = this.find_safe_numbers(tempData, empty[0], empty[1]);
        }

        while (safe.length > 0) { // loop through all safe numbers
            let index = Math.floor(Math.random() * safe.length);
            let numToCheck = safe.splice(index, 1)[0];
            tempData[empty[0]][empty[1]] = numToCheck; // set found empty cell to the first/last safe number
            let result = this.check_unique_solution(tempData, starting_cell); // recursively call to fill next cell
            if (result.unique) { // if returned successfully, return the new array
                return {
                    data: tempData,
                    unique: false
                };
            }
        }

        // could not find a solution
        // only one unique solution (the ignored path)
        return {
            data: tempData,
            unique: true
        };
    }

    remove_cells(data) {
        let tempData = this.clone_array(data);
        let coords = this.random_filled_cell(tempData);
        tempData[coords[0]][coords[1]] = 0;

        return this.remove_cell(tempData, 0);
    }

    remove_cell(data, count) {
        let tempData = this.clone_array(data);
        let coords = this.random_filled_cell(tempData);
        let removed_data = tempData[coords[0]][coords[1]];
        tempData[coords[0]][coords[1]] = 0; // clear cell

        let newData = this.check_unique_solution(tempData, 
            { 
                row: coords[0], 
                col: coords[1], 
                ignore: removed_data
            });

        if (newData.unique) {
            if (attempts < max_attempts && count < max_count) {
            // if (count < max_count) {
                return this.remove_cell(tempData, count + 1);
            } else {
                return newData.data;
            }
        } else { // solution not unique. set data back to where it was
            tempData[coords[0]][coords[1]] = removed_data;
            if (attempts < max_attempts && count < max_count) {
            // if (count < max_count) {
                return this.remove_cell(tempData, count + 1);
            } else {
                return tempData;
            }
        }
            
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

    clone_array_1d(array) {
        let newArray = [];
        for (let i = 0; i < array.length; i++) {
            newArray.push(array[i]);
        }
        return newArray;
    }

    compare_array(array1, array2) {
        return (JSON.stringify(array1) == JSON.stringify(array2));
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    addToGroup(data, list, group) {
        for (let i = 0; i < 3; i++) {
            let g = Math.floor((group - 1) / 3) * 3; //Start at row 0, 3, 6
            data[g + i][g] = list[i];
            data[g + i][g + 1] = list[i + 3];
            data[g + i][g + 2] = list[i + 6];
        }
    }

    valid(data) {
        for (let i = 0; i < data.length; i++) { // check if all rows & columns are valid
            let row = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            let col = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] != 0)
                    row[data[i][j] - 1] += 1;
                if (data[j][i] != 0)
                    col[data[j][i] - 1] += 1;
            }
            if (row.includes(2) || col.includes(2)) {
                return false;
            }
        }

        for (let i = 0; i < 3; i++) { // check if all groups are valid
            for (let j = 0; j < 3; j++) {
                let box = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (let ii = 0; ii < 3; ii++) {
                    for (let jj = 0; jj < 3; jj++) {
                        box[data[i * 3 + ii][j * 3 + jj] - 1] += 1;
                    }
                }
                if (box.includes(2) || box.includes(3)) {
                    return false;
                }
            }
        }

        return true;
    }

    draw(ctx) {
        let cellSize = Math.floor(Math.min(ctx.canvas.width - 18, ctx.canvas.height - 18) / 9);
        let origX = Math.floor(ctx.canvas.width / 2 - cellSize * 4.5);
        let origY = Math.floor(ctx.canvas.height / 2 - cellSize * 4.5);
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

