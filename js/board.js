class Board {
    constructor() {
        this.data = [];
<<<<<<< Updated upstream
        let valid = false;
        while (!valid) {
            this.generate();
            valid = this.valid(this.data);
        }
=======
        this.count = 0;
        this.generate();
>>>>>>> Stashed changes
    }

    generate(){
        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
<<<<<<< Updated upstream
        this.shuffle(nums);
=======

        for (let i = 1; i < 10; i += 4) { // create & randomize groups 1, 5, and 9
            this.shuffle(nums);
            this.addToGroup(this.data, nums, i);
        }
        this.data = this.backtrack(this.data); // recursively solve board
        this.data = this.remove_cell(this.data); // recursively remove numbers from board
    }

    backtrack(data){
        return this.pick_next_cell(data, false).data; // call recursive function
    }

    pick_next_cell(data, testing) {
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
        let safe = [];
>>>>>>> Stashed changes
        for (let i = 0; i < 9; i++) {
            this.data[i] = this.rotate(nums, 3*(i%3) + Math.floor(i/3));
        }
<<<<<<< Updated upstream
        this.flip(this.data);
=======
        
        while (safe.length > 0) { // loop through all safe numbers
            let index = 0;
            // if (!bottom_up) { // choose which safe number to check
            //     index = safe.length - 1;
            // }
            let numToCheck = safe.splice(index, 1)[0];
            tempData[empty[0]][empty[1]] = numToCheck; // set found empty cell to the first/last safe number
            let result = this.pick_next_cell(tempData); // recursively call to fill next cell
            if (result.result) { // if returned successfully, return the new array
                if (testing) {
                    // debugger
                    this.count += 1;
                    // return {
                    //     testing: true
                    // };

                } else {
                    return {
                        data: result.data,
                        result: true
                    };
                }
            }
        }

        // failed to find a valid solution
        // should never get to this point
        if (this.count==1){
            return {
                    testing: true
                };
        }
        return {
            testing: false
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
        // let result_bottom_up = this.pick_next_cell(tempData, true); // check for inconsistent solutions
        // let result_top_down = this.pick_next_cell(tempData, false);
        if (this.pick_next_cell(tempData, true).testing) {
            if (this.count <= 1) {
                this.count = 0;
                return this.remove_cell(tempData);
            } else {
                return data;
            }
        } 
        else {
            return data;
        }
    }

    clone_array(array) {
        let newArray = [];
        for (let i = 0; i < 9; i++) {
            newArray.push([]);
            for (let j = 0; j < 9; j++) {
                newArray[i].push(array[i][j]);
            }
        }
        return newArray;
    }

    compare_array(array1, array2) {
        return (JSON.stringify(array1) == JSON.stringify(array2));
>>>>>>> Stashed changes
    }

    shuffle(array) {
        for(let i = array.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
          }
    }

    flip(data){
        //flips random rows and columns in same group
        let flips = Math.round(Math.random() * 25 + 75);
        for (let i = 0; i < flips; i++) {
            //row or column?
            let RowOrCol = Math.round(Math.random());
            //which group?
            let group = Math.round(Math.random() * 2);
            //which in group?
            let one = Math.round(Math.random()*2);
            let two = one;
            while (two == one) {
                two = Math.round(Math.random()*2);
            }
            //do the flip!
            if (RowOrCol == 1){
                //flip row
                let tempArr = data[one + 3*group];
                data[one + 3*group] = data[two + 3*group];
                data[two + 3*group] = tempArr;
            }
            else {
                //flip col
                for (let i = 0; i < data.length; i++){
                    //flip one number at a time in column
                    let temp = data[i][one + 3*group];
                    data[i][one + 3*group] = data[i][two + 3*group];
                    data[i][two + 3*group] = temp;
                }
            }
        }
    }
   
    rotate(array, num){
        let len = array.length;
        let newArr = [];
        newArr.length = len;
        for (let i = 0; i < len; i++) {
            let index = i + num;
            if (index >= len){
                index -= len;
            }
            newArr[index] = array[i];
        }
        return newArr;
    }

    valid(data){
        let row = [0,0,0,0,0,0,0,0,0];
        let col = [0,0,0,0,0,0,0,0,0];
        let valid = true;
        for (let i = 0; i < this.data.length; i++) {
            let row = [0,0,0,0,0,0,0,0,0];
            let col = [0,0,0,0,0,0,0,0,0];
            for (let j = 0; j < this.data[i].length; j++) {
                row[this.data[i][j]] += 1;
                col[this.data[j][i]] += 1;
            }
            if (row.includes(2) || col.includes(2)) {
                console.log(row);
                // console.log("fail1");
                return false;
            }
        }
        let box = [0,0,0,0,0,0,0,0,0];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let box = [0,0,0,0,0,0,0,0,0];
                for (let ii = 0; ii < 3; ii++) {
                    for (let jj = 0; jj < 3; jj++) {
                        box[this.data[i*3 + ii][j*3 + jj]] += 1;
                    }
                }
                valid = (!box.includes(2) && !box.includes(3));
                if (!valid){
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
                draw_text(ctx, this.data[j][i], origX + cellSize * i + cellSize * 0.5, origY + cellSize * j + cellSize * 0.5);
            }
        }
    }

}

function line(ctx, x1, y1, x2, y2, num) {
    if (num % 3 == 0) {
        ctx.lineWidth = 3;
    } else {
        ctx.lineWidth = 1;
    }
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(Math.round(x1), Math.round(y1));
    ctx.lineTo(Math.round(x2), Math.round(y2));
    ctx.stroke();
    ctx.closePath();
}

function draw_text(ctx, text, x, y) {
    ctx.beginPath();
    ctx.fillText(text, x, y + 4);
    ctx.closePath();
}

function set_font(ctx, cellSize) {
    let size = Math.round(cellSize * 0.75);
    ctx.font = size + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
}