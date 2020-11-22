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
        for (let i = 0; i < 9; i++) {
            this.data[i] = [];
            for (let j = 0; j < 9; j++) {
                this.data[i].push(j + 1);
            }
            this.shuffle(data[i]);
        }
    }

    validRow(data){
        sumRows = 0;
        for (let j = 0; j < this.data.length; j++) {
            sumRows += this.data[j];
                this.data[i].push(j);
            }
            this.shuffle(this.data[i]);
        }
        return (sumRows == 45);
    }

    valid(data){
        let sumRows = 0;
        let sumCol = 0;
        let valid = true;
        for (let i = 0; i < this.data.length; i++) {
            sumRows = 0;
            sumCol = 0;
            for (let j = 0; j < this.data[i].length; j++) {
                sumRows += this.data[i][j];
                sumCols += this.data[j][i];
            }
            valid = (sumRows == 45 && sumCol == 45);
            sumRows = 0;
            sumCol = 0;
        }
        let sumBox = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                sumBox += data[i*3][j];
                sumBox += data[i*3 + 1][j];
                sumBox += data[i*3 + 2][j];
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