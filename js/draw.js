class Painter {
    constructor(background="white", foreground="black"){
        this.colorSchemes = [
            {
                id: 0,
                name: "Default",
                background: "rgb(245,245,245)",
                foreground: "black",
                accent: "rgb(230,230,230)"
            },
            {
                id: 1,
                name: "Dark",
                background: "rgb(10,10,10)",
                foreground: "rgb(230,230,230)",
                accent: "rgb(50,50,50)"
            },
            {
                id: 2,
                name: "Night",
                background: "rgb(0,0,85)",
                foreground: "rgb(245,245,245)",
                accent: "rgb(82,82,200)"
            },
        ];

        this.setScheme(get_url_data("colorscheme", 0));
    }
    setScheme(scheme) {
        console.log(scheme);
        $(".inputColorScheme").val(scheme);
        this.currentScheme = scheme;
        $("body, div").css('background-color', this.colorSchemes[this.currentScheme].background);
        $(".accent").css('background-color', this.colorSchemes[this.currentScheme].accent);
        $(document.body).css('color', this.colorSchemes[this.currentScheme].foreground);
    }
    line(ctx, x1, y1, x2, y2, num) {
        if (num % 3 == 0) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = this.colorSchemes[this.currentScheme].foreground;
        } else if (num == -1) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgb(0,151,255)";
        }
        else {
            ctx.lineWidth = 1;
            ctx.strokeStyle = this.colorSchemes[this.currentScheme].foreground;
        }
        ctx.beginPath();
        ctx.moveTo(Math.round(x1), Math.round(y1));
        ctx.lineTo(Math.round(x2), Math.round(y2));
        ctx.stroke();
        ctx.closePath();
    }

    draw_text(ctx, text, x, y) {
        ctx.fillStyle = this.colorSchemes[this.currentScheme].foreground;
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
        ctx.fillStyle = this.colorSchemes[this.currentScheme].foreground;
    }
    set_font_small(ctx, cellSize) {
        let size = Math.round(cellSize * 0.3);
        ctx.font = size + "px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = this.colorSchemes[this.currentScheme].foreground;
    }
}

