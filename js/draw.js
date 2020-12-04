class drawer {
    constructor(background="white", foreground="black"){
        self.background = background;
        self.foreground = foreground;
    }
    setBackground(bg){
        self.background = bg;
    }
    setForeground(fg){
        self.foreground = fg;
    }
    line(ctx, x1, y1, x2, y2, num) {
        if (num % 3 == 0) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = self.foreground;
        } else if (num == -1) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgb(0,151,255)";
        }
        else {
            ctx.lineWidth = 1;
            ctx.strokeStyle = self.foreground;
        }
        ctx.beginPath();
        ctx.moveTo(Math.round(x1), Math.round(y1));
        ctx.lineTo(Math.round(x2), Math.round(y2));
        ctx.stroke();
        ctx.closePath();
    }

    draw_text(ctx, text, x, y) {
        if (text != 10) {
            ctx.beginPath();
            ctx.fillText(text, x, y + 4);
            ctx.closePath();
        }
    }
    set_font(ctx, cellSize) {
        let size = Math.round(cellSize * 0.75);
        ctx.font = size + "px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = self.foreground;
    }
    set_font_small(ctx, cellSize) {
        let size = Math.round(cellSize * 0.3);
        ctx.font = size + "px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = self.foreground;
    }
}

var draw1 = new drawer();