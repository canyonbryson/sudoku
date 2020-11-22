class Board {
    constructor() {
        this.data = [];
        let valid = false;
        while (!valid) {
            this.generate();
            valid = this.valid(this.data);
        }
    }

    generate(){
        this.data.length = 9;
        for (let i = 0; i < 9; i++){
            this.data[i] = [0,0,0,0,0,0,0,0,0];
        }
        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.shuffle(nums);
        this.addToGroup(this.data, nums, 1);
        this.shuffle(nums);
        this.addToGroup(this.data, nums, 5);
        this.shuffle(nums);
        this.addToGroup(this.data, nums, 9);
        this.backtrack(this.data);
    }

    backtrack(data){
        // assign zeros to all cells
        // randomly generate 3 groups
        data = this.pick_next_cell();
        return data;
    }

    pick_next_cell(data) {
        // duplicate data array
        let tempData = data;

        // find next empty cell
        // if no empty cells, return data
        let empty = [-1, -1];
        for (let i = 0; i < tempData.length; i++) {
            for (let j = 0; j < tempData.length; j++) {
                if (tempData[i][j] == 0) {
                    empty = [i, j];
                    break;
                }
            }
            if (empty != [-1, -1]) {
                break;
            }
        }
        if (empty == [-1, -1]) {
            return tempData;
        }

        // initalize empty safe array
        // for loop 0-8
        //      assign next empty cell each number
        //      append number to safe array if new grid is valid
        
        // loop through all safe numbers
        //      recursively call pick_next_cell() for each safe number
        //      if any call returns true, return data

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
        // group - 1 % 3 = 0 1 2, * floor(group / 3)
        for (let i = 0; i < 3; i++){
            let g = Math.floor((group - 1)/3) * 3; //Start at row 0, 3, 6
            data[g + i][g] = list[i];
            data[g + i][g + 1] = list[i+3];
            data[g + i][g + 2] = list[i+6];
        }
    }

    valid(data){
        let row = [0,0,0,0,0,0,0,0,0];
        let col = [0,0,0,0,0,0,0,0,0];
        let valid = true;
        for (let i = 0; i < this.data.length; i++) {
            row = [0,0,0,0,0,0,0,0,0];
            col = [0,0,0,0,0,0,0,0,0];
            for (let j = 0; j < this.data[i].length; j++) {
                row[this.data[i][j]] += 1;
                col[this.data[j][i]] += 1;
            }
            valid = (!row.includes(2) && !col.includes(2));
            if (!valid){
                return valid;
            }
        }
        let box = [0,0,0,0,0,0,0,0,0];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                box = [0,0,0,0,0,0,0,0,0];
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
        return valid;
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