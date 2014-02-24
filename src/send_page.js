var editing_title = false;

$(function(){

    $("#send_scandaloh").click(function(){
        send_scandaloh();
    });

    if (localStorage["scandaloh_image_url"] != undefined){
        // Set image on Canvas
        var canvas = document.getElementById("scandaloh_image")
        var context = canvas.getContext('2d');
        var imageObj = new Image();

        imageObj.onload = function() {
            canvas.setAttribute('width', imageObj.width);
            canvas.setAttribute('height', imageObj.height);
            context.drawImage(imageObj, 0, 0);
        };
        imageObj.src = localStorage["scandaloh_image_url"];
    }

    var urlLink = "<a href= \"" + localStorage["scandaloh_page_url"] +"\" target=\"_blank\"></a>";

    $('#page_title').text(localStorage["scandaloh_page_title"]);

    // Create links to original web
    $('#page_url').wrap(urlLink);
    $('#page_title').wrap(urlLink);
    $('#scandaloh_image').wrap(urlLink);

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

})

var scandalohController = {

    setTitle: function (title){
        $("#page_title").text(title);
    },

    setUrl: function (url){
        $("page_url").text(url);
    }

}

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

    // Generate image data
    var pic = document.getElementById("scandaloh_image").toDataURL("image/png");
    pic = pic.replace(/^data:image\/(png|jpeg);base64,/, "");

    scandaloh.user = localStorage['user_resource'];
    scandaloh.country = "ES"; //TODO
    scandaloh.category = ($('#humor_radio').is(':checked')) ? '/api/v1/category/1/' :
        '/api/v1/category/2/';
    scandaloh.title = (editing_title) ? $("#edited_title").val() : $("#page_title").text();
    scandaloh.img = pic;

    // Retrieve comment
    var comment = $('#scandaloh_comment').val();

    if (scandaloh.title == ""){
        showNotification("Error", "Introduce un título para el scandaloh", "/images/scandaloh_48.png", 4000);
    } else {
        ajaxRequest(POST_SERVICES['send_scandaloh'], scandaloh, function(response){
            scandalohResource = scandalohResponse(response)
            if (comment != ""){
                sendComment(scandaloh.user, scandalohResource, comment);
            }
        }, scandalohError)
    }

//    var formData = new FormData();
//
//    formData.append("user", scandaloh.user);
//    formData.append("country", scandaloh.country);
//    formData.append("category", scandaloh.category);
//    formData.append("title", scandaloh.title);
//    formData.append("img", pic, "lol.png");

//    $.ajax({
//        url: SCANDALOH_SERVER_URL + POST_SERVICES["send_scandaloh"],
//        type: "POST",
//        data: formData,
//        processData: false,  // tell jQuery not to process the data
//        contentType: false,   // tell jQuery not to set contentType
//        timeout: 5000
//    }).done(scandalohResponse).fail(scandalohError);;

}