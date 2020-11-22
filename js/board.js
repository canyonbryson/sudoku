class Board {
    constructor() {
        this.data = [];
        this.generate();
    }
    
    shuffle(array) {
        for(let i = array.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
          }
    }

    generate() {
        this.data = [];
        for (let i = 0; i < 9; i++) {
            this.data[i] = [];
            for (let j = 0; j < 9; j++) {
                let possibleNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                while (true) {
                    let rand = Math.floor(Math.random() * possibleNums.length);
                    let isValid = true;
                    if (isValid) {
                        this.data[i][j] = possibleNums[rand];
                        break;
                    } else {
                        possibleNums = possibleNums.splice(rand, 1);
                    }
                    if (possibleNums.length == 0) { // failed.
                        console.log("failed");
                        this.generate();
                        break;
                    }
                }
            }
        }
    }

    // validRow(data){
    //     sumRows = 0;
    //     for (let j = 0; j < this.data.length; j++) {
    //         sumRows += this.data[j];
    //             this.data[i].push(j);
    //         }
    //         this.shuffle(this.data[i]);
    //     }
    //     return (sumRows == 45);
    // }

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
                // box[this.data[][]]
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
                        // sumBox += data[i*3][j];
                        // sumBox += data[i*3 + 1][j];
                        // sumBox += data[i*3 + 2][j];
                        box[this.data[i*3 + ii][j*3 + jj]] += 1;
                    }
                }
                valid = (!box.includes(2));
                if (!valid){
                    return false;
                }
            }
        }
        valid = (sumBox == 45);
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