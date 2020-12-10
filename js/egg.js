class Egg {
    static init(ctx) {
        this.count = 0;
        this.ctx = ctx;
    }

    static increment() {
        this.count++;
        if (this.count == 10) {
            Timer.stop();
            Board.inactive = true;
            Message.show(this.ctx, "egg");
        }
    }
}