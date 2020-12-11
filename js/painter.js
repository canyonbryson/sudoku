class Painter {
    static colorSchemes = [
        {
            id: 0,
            name: "Default",
            background: "rgb(245,245,245)",
            foreground: "black",
            accent: "rgb(230,230,230)",
            accent2: "rgb(180,180,180)",
            highlightGradient: ["rgba(0,62,214,0.09)", "rgba(0,151,255,0.8)"]
        },
        {
            id: 1,
            name: "Dark",
            background: "rgb(10,10,10)",
            foreground: "rgb(230,230,230)",
            accent: "rgb(50,50,50)",
            accent2: "rgb(100,100,100)",
            highlightGradient: ["rgba(20,80,230,0.09)", "rgba(100,200,255,0.9)"]
        },
        {
            id: 2,
            name: "Night",
            background: "rgb(0,0,85)",
            foreground: "rgb(245,245,245)",
            accent: "rgb(82,82,200)",
            accent2: "rgb(130,130,230)",
            highlightGradient: ["rgba(255,255,255,0.09)", "rgba(255,255,255,0.9)"]
        },
    ];

    static init() {
        this.setScheme(Preferences.get("color_scheme",0));
    }

    static setScheme(scheme) {
        $(".pref_color_scheme").val(scheme);
        this.currentScheme = scheme;

        this.background = this.colorSchemes[this.currentScheme].background;
        this.foreground = this.colorSchemes[this.currentScheme].foreground;
        this.accent = this.colorSchemes[this.currentScheme].accent;
        this.accent2 = this.colorSchemes[this.currentScheme].accent2;
        this.highlightGradient = this.colorSchemes[this.currentScheme].highlightGradient;

        $("body, .background").css('background-color', this.background);
        $(".accent").css('background-color', this.accent);
        $(document.body).css('color', this.foreground);
        $(".foreground").css('color', this.foreground);
    }

    static line(ctx, x1, y1, x2, y2, num) {
        if (num % 3 == 0) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = this.foreground;
        } else if (num == -1) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgb(0,151,255)";
        }
        else {
            ctx.lineWidth = 1;
            ctx.strokeStyle = this.foreground;
        }
        ctx.beginPath();
        ctx.moveTo(Math.round(x1), Math.round(y1));
        ctx.lineTo(Math.round(x2), Math.round(y2));
        ctx.stroke();
        ctx.closePath();
    }

    static draw_text(ctx, text, x, y, wrong=false) {
        ctx.fillStyle = this.foreground;
        if (wrong) {
            ctx.fillStyle = "red";
        }
        if (text != 10) {
            ctx.beginPath();
            ctx.fillText(text, x, y + 4);
            ctx.closePath();
        }
    }

    static set_font(ctx, cellSize) {
        let size = Math.round(cellSize * 0.75);
        ctx.font = size + "px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.foreground;
    }

    static set_font_small(ctx, cellSize) {
        let size = Math.round(cellSize * 0.3);
        ctx.font = size + "px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = this.foreground;
    }
}

