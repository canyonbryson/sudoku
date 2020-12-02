class Timer {
    constructor(ctx) {
        this.time = Date.now();
        this.ctx = ctx;
        this.start();
    }

    start() {
        this.draw(this);
        this.clock = setInterval(this.draw, 1000, this);
    }

    stop() {
        clearInterval(this.clock);
    }

    draw(self) {
        let timeElapsed = Math.round((Date.now() - self.time) / 1000);

        self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
        self.ctx.textAlign = "left";
        self.ctx.textBaseline = "bottom";    
        self.ctx.font = "24px Arial";
        self.ctx.fillStyle = "black";
        self.ctx.fillText(self.formatSeconds(timeElapsed), 16, self.ctx.canvas.height - 16);
        self.ctx.textAlign = "center";
        self.ctx.textBaseline = "middle";
    }

    formatSeconds(total) {
        let sec = total % 60;
        let min = (total - sec) / 60;
        let txtSec = (sec < 10) ? "0" + sec : sec;
        let txtMin = (min < 10) ? "0" + min : min;
        return txtMin + ":" + txtSec;
    }
}