"use strict";

document.addEventListener('DOMContentLoaded', function() {
    var go_button = document.getElementById("go_button");
    var clear_button = document.getElementById("clear_button");
    var help_text_input = document.getElementById("help_text_input");
    var main_text_input = document.getElementById("main_text_input");
    var canvas = document.getElementById("textCanvas");
    var copyable = document.getElementById("copyable");
    var ctx = canvas.getContext("2d");

    var image_to_copy = document.getElementById("image_to_copy")

    var help_font_size = "40px";
    var help_font_style = "'Times New Roman'";

    var main_font_size = "100px";
    var main_font_style = "'Times New Roman'";

    canvas.width = 200;
    canvas.height = 150;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";

    ctx.textAlign = "center";

    go_button.addEventListener("click", function() {
        var help_text = help_text_input.value;
        var main_text = main_text_input.value;

        // Clear previous text
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Prepare canvas for Help text
        ctx.font = help_font_size + " " + help_font_style;
        // Render help text
        ctx.fillText(help_text, canvas.width / 2, 40);

        // Prepare canvas for Main text
        ctx.font = main_font_size + " " + main_font_style;
        // Render main text
        ctx.fillText(main_text, canvas.width / 2, 130);

        image_to_copy.setAttribute("src", canvas.toDataURL("image/png"))
    });

    clear_button.addEventListener("click", function() {
        help_text_input.value = "";
        main_text_input.value = "";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        image_to_copy.setAttribute("src", "")
    });


});
