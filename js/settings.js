var painter;

window.onload = function () {
    painter = new Painter();
    $(".btnScheme").bind('touchend', function() {
        painter.setScheme(this.value);
    });
}