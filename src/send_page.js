// Global controlling whether the title has been manually edited
var editing_title = false;
var preview_data = null;


$(function(){

    $("#send_scandaloh").click(function(){
        send_scandaloh();
    });

    /*
    if (localStorage["scandaloh_image_url"] != undefined){
        // Set image on Canvas
        var canvas = document.getElementById("scandaloh_image");
        var context = canvas.getContext('2d');
        var imageObj = new Image();

        imageObj.onload = function() {
            canvas.setAttribute('width', imageObj.width);
            canvas.setAttribute('height', imageObj.height);
            context.drawImage(imageObj, 0, 0);
        };
        imageObj.src = localStorage["scandaloh_image_url"];
    }

    // Get page favicon
    var favCanvas = document.getElementById("favicon");
    var favContext = favCanvas.getContext('2d');
    var faviconObj = new Image();

    faviconObj.onload = function() {
        favCanvas.setAttribute('width', faviconObj.width);
        favCanvas.setAttribute('height', faviconObj.height);
        favContext.drawImage(faviconObj, 0, 0);
    };
    faviconObj.src = "http://" + getUrlDomain(localStorage["scandaloh_page_url"]) + "/favicon.ico";
    */

    var urlLink = "<a href= \"" + localStorage["scandaloh_page_url"] +"\" target=\"_blank\"></a>";

    ajaxRequest(
        POST_SERVICES['preview_url'],
        {"url": localStorage["scandaloh_page_url"]},
        function(response){
            preview_data = response;
            $('#scandaloh_image').append('<img src="' + response.img + '">');
            $('#favicon').append('<img src="' + response.favicon + '">');
            $('#page_title').text(response.title);
            // Create links to original web
            $('#page_title').wrap(urlLink);
            $('#scandaloh_image').wrap(urlLink);
        },
        scandalohError
    );

    $("#edit_title").click(function(){
        if (!editing_title) {
            editing_title = true;
            $("#edited_title").css({'display': ''})
            $("#original_title").css({'display': 'none'})
        }
    });

    $("#edited_title").keypress(function(e) {
        if (e.which == 13){
            editing_title = false;
            $("#original_title").css({'display': ''})
            $("#edited_title").css({'display': 'none'})

            $("#page_title").text("");
            $("#page_title").append($("#edited_title").val());
            $("#page_title").wrap(urlLink);
        }
    })
});

var scandalohController = {

    setTitle: function (title){
        $("#page_title").text(title);
    },

    setUrl: function (url){
        $("page_url").text(url);
    }

};

/**
function commentResponse(response){
    if (response.status == "error"){
        showNotification("Error con comentario", response.reason, "/images/scandaloh_48.png", 4000);
    } else {
        showNotification("Comentario enviado", "Todo correcto", "/images/scandaloh_48.png", 4000);
    }
}

function commentError(response){
    showNotification("Error en el server", "ERROR", "/images/scandaloh_48.png", 4000);
}

function sendComment(userResource, photoResource, text){
    comment = Object();
    comment.user = userResource;
    comment.photo = photoResource;
    comment.text = text;

    ajaxRequest(POST_SERVICES['send_comment'], comment, commentResponse, commentError);
}
 */

function scandalohResponse(response){
    if (response.status == "error"){
        showNotification("Error", response.reason.error_message, "/images/scandaloh_48.png", 4000);
    } else {
        showNotification("Scandaloh enviado", "Todo correcto", "/images/scandaloh_48.png", 4000);
    }

    return response.resource_uri;
}

function scandalohError(response){
    showNotification("Error en el server", "ERROR" , "/images/scandaloh_48.png", 4000);
}

function send_scandaloh(){
    var scandaloh = Object();

    /*
    // Generate image data
    var image = document.getElementById("scandaloh_image").toDataURL("image/png");
    image = image.replace(/^data:image\/(png|jpeg);base64,/, "");

    var favicon = document.getElementById("favicon").toDataURL("image/png");
    favicon = favicon.replace(/^data:image\/(png|jpeg);base64,/, "");

    //scandaloh.user = localStorage['user_resource'];
    */

    scandaloh.country = $('#country').val();
    scandaloh.category = ($('#humor_radio').is(':checked')) ? '/api/v1/category/1/' :
        '/api/v1/category/2/';
    scandaloh.title = (editing_title) ? $("#edited_title").val() : $("#page_title").text();
    scandaloh.img = preview_data.img;
    scandaloh.source = preview_data.source;
    scandaloh.favicon = preview_data.favicon;
    scandaloh.media_type = 1;

    // Retrieve comment
    var comment = $('#scandaloh_comment').val();
    if (comment != ""){
        scandaloh.comment = comment;
    }

    if (scandaloh.title == ""){
        showNotification("Error", "Introduce un título para el scandaloh", "/images/scandaloh_48.png", 4000);
    } else {
        ajaxRequest(POST_SERVICES['send_scandaloh'], scandaloh, function(response){
            scandalohResource = scandalohResponse(response);
            window.setTimeout(function(){
                window.close();
            }, 4100);
        }, scandalohError)
    }
}