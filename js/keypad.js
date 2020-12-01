class Keypad {
    constructor(origX, origY, cellSize) {
        this.origX = origX + cellSize * 3.5;
        this.origY = origY + cellSize * 10;
        this.cellSize = cellSize;

        this.selectedNum = -1;
    }

    getNumber(x, y) {
        //returns which value was selected
        y -= this.origY;
        x -= this.numbers[0][0];
        let col = Math.floor(x / this.cellSize);
        let row = Math.round(y / this.cellSize);
        if(row > 5 || col > 1 || row < 0 || col < 0){
            return -1;
        }
        let num = row + col*5;
        if (num <= 0 || num > 10){
            return -1;
        }
        if (num == 10){
            num = 0;
        }
        return num;
    }

    getClickedNumber(x, y) {
        let relative_x = x - this.origX + this.cellSize / 2;
        let relative_y = y - this.origY + this.cellSize / 2;
        let col = Math.floor(relative_x / this.cellSize);
        let row = Math.floor(relative_y / this.cellSize);
        if (col >= 0 && col <= 2) {
            if (row >= 0 && row <= 2) {
                // clicked on number
                return row * 3 + col + 1;
            } else {
                if (row == 3 && col == 1) {
                    // clicked on clear button
                    return 0;
                }
            }
        }
        return -1; // not clicked on number
    }
    
    draw(ctx) {
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(this.origX - this.cellSize / 2, this.origY - this.cellSize / 2, this.cellSize * 3, this.cellSize * 3);
        ctx.fillRect(this.origX - this.cellSize / 2, this.origY + this.cellSize * 2.5, this.cellSize * 2, this.cellSize);
        ctx.fillStyle = "black";
        for (let i = 0; i < 4; i++) {
            line(ctx, this.origX + this.cellSize * (i - 0.5), this.origY - this.cellSize / 2, this.origX + this.cellSize * (i - 0.5), this.origY + this.cellSize * 2.5, i);
        }
        for (let j = 0; j < 3; j++) {
            line(ctx, this.origX - this.cellSize / 2, this.origY + this.cellSize * (j - 0.5), this.origX + this.cellSize * 2.5, this.origY + this.cellSize * (j - 0.5), j);
        }

        // horizontal lines row 3
        line(ctx, this.origX - this.cellSize / 2, this.origY + this.cellSize * 2.5, this.origX + this.cellSize / 2, this.origY + this.cellSize * 2.5, 1);
        line(ctx, this.origX + this.cellSize / 2, this.origY + this.cellSize * 2.5, this.origX + this.cellSize * 1.5, this.origY + this.cellSize * 2.5, 1);
        line(ctx, this.origX + this.cellSize * 1.5, this.origY + this.cellSize * 2.5, this.origX + this.cellSize * 2.5, this.origY + this.cellSize * 2.5, 0);
        

        // vertical lines row 3
        line(ctx, this.origX - this.cellSize / 2, this.origY + this.cellSize * 2.5, this.origX - this.cellSize / 2, this.origY + this.cellSize * 3.5, 0);
        line(ctx, this.origX + this.cellSize / 2, this.origY + this.cellSize * 2.5, this.origX + this.cellSize / 2, this.origY + this.cellSize * 3.5, 1);
        line(ctx, this.origX + this.cellSize * 1.5, this.origY + this.cellSize * 2.5, this.origX + this.cellSize * 1.5, this.origY + this.cellSize * 3.5, 0);

        // bottom border
        line(ctx, this.origX - this.cellSize / 2, this.origY + this.cellSize * 3.5, this.origX + this.cellSize * 1.5, this.origY + this.cellSize * 3.5, 0);
        
        for (let i = 0; i < 9; i++) {
            let column = i % 3;
            let row = Math.floor((i - column) / 3);
            draw_text(ctx, i + 1, this.origX + column * this.cellSize, this.origY + row * this.cellSize);
        }
        draw_text(ctx, "C", this.origX + this.cellSize, this.origY + 3 * this.cellSize);
        draw_text(ctx, "N", this.origX, this.origY + 3 * this.cellSize);
    }

    getNumber(x, y) {
        //returns which value was selected
        y -= this.origY;
        x -= this.numbers[0][0];
        let col = Math.floor(x / this.cellSize);
        let row = Math.round(y / this.cellSize);
        if(row > 5 || col > 1 || row < 0 || col < 0){
            return -1;
        }
        let num = row + col*5;
        if (num <= 0 || num > 10){
            return -1;
        }
        if (num == 10){
            num = 0;
        }
        return num;
    }
}
