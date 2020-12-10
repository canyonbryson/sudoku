class Timer {
    static init(ctx) {
        this.time = Date.now();
        this.ctx = ctx;
        this.difficulty = "";
        switch (Preferences.get("difficulty", 1)) {
            case 1: 
                this.difficulty = "Easy";
                break;
            case 2:
                this.difficulty = "Medium";
                break;
            case 3:
                this.difficulty = "Hard";
        }
        this.start();
    }

    static start() {
        this.draw();
        this.clock = setInterval(this.draw, 1000);
    }

    static stop() {
        clearInterval(this.clock);
    }

    static draw() {
        let timeElapsed = Math.round((Date.now() - Timer.time) / 1000);

        Timer.ctx.clearRect(0, 0, Timer.ctx.canvas.width, Timer.ctx.canvas.height);
        Timer.ctx.textAlign = "left";
        Timer.ctx.textBaseline = "bottom";    
        Timer.ctx.font = "24px Arial";
        Timer.ctx.fillStyle = Painter.foreground;
        Timer.ctx.fillText(Timer.formatSeconds(timeElapsed), 16, Timer.ctx.canvas.height - 16);
        Timer.ctx.textAlign = "right";
        Timer.ctx.fillText(Timer.difficulty, window.innerWidth - 16, Timer.ctx.canvas.height - 16);
        Timer.ctx.textAlign = "center";
        Timer.ctx.textBaseline = "middle";
    }

    static formatSeconds(total) {
        let sec = total % 60;
        let min = (total - sec) / 60;
        let txtSec = (sec < 10) ? "0" + sec : sec;
        let txtMin = (min < 10) ? "0" + min : min;
        return txtMin + ":" + txtSec;
    }
}