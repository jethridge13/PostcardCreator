// Variables for use with fonts
var active_fonts = 0;
var font_array = [];

// Variables for use with the canvas
var imageLoader;
var canvas;
var ctx;
var background;

$(document).ready(function () {
    // Listener for the file broswer button
    imageLoader = document.getElementById('file_broswer');
    imageLoader.addEventListener('change', uploadImage, false);
    
    // Assigning the canvas and canvas context to the necessary variables
    canvas = document.getElementById('main_canvas');
    ctx = canvas.getContext('2d');
    background = -1;
})



// onclick events
$(document).on('click', '#add_font', function () {
    changeFontOptions($(this).html());
});

$(document).on('click', '#send_email', function () {
    openEmailPrompt(($(this).html()));
});

// Function for loading the image from the user
function uploadImage(image) {
    canvas.background = 'red';
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
        img.src = event.target.result;
        background = img;
    }
    reader.readAsDataURL(image.target.files[0]);
}

// Function for asking the user for the recipient's email address
function openEmailPrompt() {
    var email = prompt("Enter the recipient's email address for the postcard: ");
    if (email != null && email != "") {
        sendEmail(email);
    }
}

// Add an additional font section to the page
function changeFontOptions() {
    // Add a div for the font
    var font_id = "" + active_fonts;
    $("#fonts").append("<div id='" + font_id + "' class='well well-sm'></div>");
    var font_id_old = font_id;
    font_id = "#" + font_id;

    var font_div = $(font_id);

    // Title for the font
    font_div.append("<h3><div class='menu_title'></div></h3>");
    var menu_title_div = font_div.find(".menu_title");
    menu_title_div.text("Font ");
    menu_title_div.append("<span class='font_id'>" + font_id + "</span>");

    // Add the text add section
    font_div.append("<div class='form-group'> \n\
                <label for='comment'>Comment:</label>\n\
<textarea class='form-control' rows='5' id='comment_" + font_id_old + "'></textarea></div>");

    // Add in the font selector panel
    var font_selector_id = "font_selector_" + font_id_old;
    font_div.append("<div class='form-group' id='" + font_selector_id + "'></div>");
    font_selector_id = "#" + font_selector_id;
    var font_selector = font_div.find(font_selector_id);
    font_selector.append("<label for=font_select>Select Font: </label>");
    font_selector.append("<select class='form-control' id='font_select_" + font_id_old + "'> \n\
    <option>Times New Roman</option>\n\
<option>Comic Sans MS</option>\n\
<option>Impact</option>\n\
<option>Verdana</option>\n\
</select>");

    // Add in font size
    font_div.append("Size: <input type='text' class='form-control' id='size_" + font_id_old + "' \n\
bfh-number' data-min='8' data-max='72'>");

    // Add in the position controls
    font_div.append("X: <input type='text' class='form-control' id='X_" + font_id_old + "' \n\
bfh-number' data-min='0'>");
    font_div.append("Y: <input type='text' class='form-control' id='Y_" + font_id_old + "' \n\
bfh-number' data-min='0'>");

    // Add in the Update button
    font_div.append("<button type='button' id='update_" + font_id_old + "' class='btn btn-default'\n\
onclick='updateFont(this)'>Update</button>");

    //Add in the remove button
    font_div.append("<button type='button' id='remove_" + font_id_old + "' class='btn btn-default'\n\
onclick='removeFont(this)'>Remove</button>");

    active_fonts++;
    font_array.push(parseInt(font_id_old));
}

// Send the email information to the server
function sendEmail(email) {
    console.log("TEST");
    var canvasURL = canvas.toDataURL();
    console.log(email);
    console.log(canvasURL);

    $.ajax({
        type: "POST",
        url: "./email",
        data: {
            imgBase64: canvasURL,
            email: email
        },
        success: function () {
            alert("Email sent successfully!");
        }
    });
}

// Deprecated function for updating fonts
function updateFont(object) {
    //console.log(object.id);
    updateCanvas();
}

// Redraws the canvas with the picture and then all additional fonts
function updateCanvas() {
    // Clear the canvas to redraw all the fonts
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Place the picture on the canvas
    if (background != -1) {
        ctx.drawImage(background, 0, 0);
    }


    // Go through and add back in all the fonts
    for (var i = 0; i < font_array.length; i++) {
        var font_to_display = document.getElementById(font_array[i]);
        var font_content = "comment_" + font_array[i];
        font_content = document.getElementById(font_content).value;
        var font_type = "font_select_" + font_array[i];
        font_type = document.getElementById(font_type).value;
        var font_size = "size_" + font_array[i];
        font_size = document.getElementById(font_size).value + "px";
        var font_x = "X_" + font_array[i];
        font_x = document.getElementById(font_x).value;
        var font_y = "Y_" + font_array[i];
        font_y = document.getElementById(font_y).value;

        ctx.font = font_size + " " + font_type;
        var x = parseInt(font_x);
        var y = parseInt(font_y);
        ctx.fillText(font_content, x, y);
    }
}

// Remove the font from the font list and font panel
function removeFont(object) {
    // Get the font number to remove from the array
    var font_number = object.id.toString();
    font_number = font_number.replace(/[^\d.]/g, '');
    font_number = parseInt(font_number);
    //console.log(font_number);

    // Find the index in the array to remove
    var index = font_array.indexOf(font_number);

    // Remove from the array
    if (index > -1) {
        font_array.splice(index, 1);
    }

    var font_to_remove = document.getElementById(font_number);
    font_to_remove.outerHTML = "";

    updateCanvas();
}

// Open the side help bar
function openNav() {
    document.getElementById("sidenav").style.width = "250px";
}

// Close the side help bar
function closeNav() {
    document.getElementById("sidenav").style.width = "0";
}