class Board {
    constructor() {
        this.data = [];
        this.generate();
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
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {

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