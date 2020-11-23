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