class Board {
    constructor() {
        this.data = [];
        this.generate();
    }

    generate() {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.data[i].length; j++) {
                this.data[i].push(j);
            }
            shuffle(data[i]);
        }
    }

    // validate(data){
    //     for (let i = 0; i < this.data.length; i++) {
    //         this.data[i] = [];
    //         for (let j = 0; j < this.data[i].length; j++) {
    //             this.data[i].push(j);
    //         }
    //         shuffle(data[i]);
    //     }
    // }

    draw(ctx) {
        let cellSize = Math.floor(Math.min(ctx.canvas.width, ctx.canvas.height) / 9);
        let origX = Math.floor(ctx.canvas.width / 2 - cellSize * 4.5);
        let origY = Math.floor(ctx.canvas.height / 2 - cellSize * 4.5);
        for (let i = 0; i < this.data.length; i++) {
            if (i != this.data.length - 1) { // draw vertical lines
                line(ctx, origX + cellSize * i, origY, origX + celLSize * i, origY + cellSize * 9);
            }
            for (let j = 0; j < this.data[i].length; j++) {
                if (i == 0) { // draw horizontal lines
                    line(ctx, origX, origY + cellSize * i, origX + cellSize * 9, origY + celLSize * i);
                }
                // text(this.data[i][j], origX + cellSize * i + cellSize * 0.5, origY + cellSize * j + cellSize * 0.5);
            }
        }
    }

    shuffle(array){
        for(let i = array.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
          }
    }
}

function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function text(text, x, y) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
    ctx.closePath();

}