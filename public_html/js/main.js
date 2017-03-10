var active_fonts = 0;
var font_array = [];

var imageLoader = document.getElementById('file_broswer');
imageLoader.addEventListener('change', uploadImage, false);

var canvas = document.getElementById('main_canvas');
var ctx = canvas.getContext('2d');

// onclick events
$(document).on('click', '#add_font', function () {
    changeFontOptions($(this).html());
});

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
    }
    reader.readAsDataURL(image.target.files[0]);
}

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
<textarea class='form-control' rows='5' id='comment'></textarea></div>");

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
    font_div.append("Size: <input type='text' class='form-control id='size_" + font_id_old + "' \n\
bfh-number' data-min='8' data-max='72'>");

    // Add in the position controls
    font_div.append("X: <input type='text' class='form-control id='X_" + font_id_old + "' \n\
bfh-number' data-min='0'>");
    font_div.append("Y: <input type='text' class='form-control id='Y_" + font_id_old + "' \n\
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

function updateFont(object){
    //TODO
    //console.log(object.id);
    updateCanvas();
}

function updateCavnas(){
    
}

function removeFont(object){
    // Get the font number to remove from the array
    var font_number = object.id.toString();
    font_number = font_number.replace(/[^\d.]/g, '');
    font_number = parseInt(font_number);
    //console.log(font_number);
    
    // Find the index in the array to remove
    var index = font_array.indexOf(font_number);
    
    // Remove from the array
    if(index > -1){
        font_array.splice(index, 1);
    }
    
    var font_to_remove = document.getElementById(font_number);
    font_to_remove.outerHTML = "";
    
    updateCanvas();
}