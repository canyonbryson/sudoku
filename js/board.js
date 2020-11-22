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
        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.shuffle(nums);
        for (let i = 0; i < 9; i++) {
            this.data[i] = this.rotate(nums, 3*(i%3) + Math.floor(i/3));
        }
        this.flip(this.data);
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