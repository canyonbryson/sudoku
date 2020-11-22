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