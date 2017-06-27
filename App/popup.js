"use strict";

/**
 * @todo add an icon for the extensions page.
 *
 * @todo add settings button (V2).
 * @todo allow selection of font family, color and size (V2).
 * @todo allow selection of text position (top or bottom) (V2).
 * @todo allow storage of text in a "favorites" list (V2).
 */
document.addEventListener("DOMContentLoaded", function() {
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

    var min_canvas_width = 200;
    var min_canvas_height = 150;
    var canvas_height_width_ratio = min_canvas_height / min_canvas_width;

    canvas.width = min_canvas_width;
    canvas.height = min_canvas_height;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";

    function renderText() {
        var help_text = help_text_input.value;
        var main_text = main_text_input.value;
        ctx.textAlign = "center";


        // Clear previous text
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Prepare canvas for Help text
        ctx.font = help_font_size + " " + help_font_style;
        // Render help text
        ctx.fillText(help_text, canvas.width / 2, canvas.height * 0.3);

        // Prepare canvas for Main text
        ctx.font = main_font_size + " " + main_font_style;
        // Render main text
        ctx.fillText(main_text, canvas.width / 2, canvas.height * 0.8);

        image_to_copy.setAttribute("src", canvas.toDataURL("image/png"))
    }

    function restoreTexts() {
        chrome.storage.sync.get(["help_text", "main_text"], function(objects) {
            help_text_input.value = objects.help_text || "";
            main_text_input.value = objects.main_text || "";

            renderText();
            recalculateDimensions();
        });
    }

    /**
     * @todo fit text within image borders.
     */
    function recalculateDimensions() {
        var help_text = help_text_input.value;
        var main_text = main_text_input.value;

        var help_text_width = ctx.measureText(help_text).width / 2.5;
        var main_text_width = ctx.measureText(main_text).width;

        var biggest_width = Math.max(help_text_width, main_text_width);

        if (biggest_width <= min_canvas_width) {
            canvas.width = min_canvas_width;
            canvas.height = min_canvas_height;
        } else {
            canvas.width = biggest_width;
            canvas.height = biggest_width * canvas_height_width_ratio;
        }
    }

    help_text_input.addEventListener("input", recalculateDimensions);
    help_text_input.addEventListener("input", renderText);
    main_text_input.addEventListener("input", recalculateDimensions);
    main_text_input.addEventListener("input", renderText);

    clear_button.addEventListener("click", function() {
        help_text_input.value = "";
        main_text_input.value = "";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        image_to_copy.setAttribute("src", "")
    });

    var links = document.getElementsByTagName("a");

    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function(event) {
            // Create new tab with the address
            chrome.tabs.create({
                url: event.target.href
            });
        });
    }

    restoreTexts();


    var storeTexts = function() {
        var help_text = help_text_input.value;
        var main_text = main_text_input.value;

        chrome.storage.sync.set({
            "help_text": help_text,
            "main_text": main_text
        });
    }

    var throttledStoreTexts = _.throttle(storeTexts, 500);

    help_text_input.addEventListener("input", throttledStoreTexts);
    main_text_input.addEventListener("input", throttledStoreTexts);
});
