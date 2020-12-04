window.onload = function () {
    var background;
    var foreground;

    $('#default').bind('touchstart', function (e) {
        //colors, white and black and grey and blue
        background = 'white';
        foreground = 'black';
        draw1.setBackground(background);
        draw1.setForeground(foreground);
        //html background and text
        document.body.style.background = background;
        document.body.style.color = foreground;
        console.log("clicked default");
    });

    $('#dark').bind('touchstart', function (e) {
        //colors, black and white and grey and blue
        background = 'black';
        foreground = 'white';
        draw1.setBackground(background);
        draw1.setForeground(foreground);
        document.body.style.background = background;
        document.body.style.color = foreground;
    });

    $('#default').bind('touchstart', function (e) {
        //colors, dark blue and white and grey and blue
        background = 'dark blue';
        foreground = 'white';
        draw1.setBackground(background);
        draw1.setForeground(foreground);
        document.body.style.background = background;
        document.body.style.color = foreground;
    });
}