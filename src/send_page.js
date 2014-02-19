var editing_title = false;

$(function(){

    $("#send_scandaloh").click(function(){
        send_scandaloh();
    });

    if (localStorage["scandaloh_image_url"] != undefined){
        $('#scandaloh_image').append("<img src=\"" + localStorage["scandaloh_image_url"] + "\">")
    }

    var urlLink = "<a href= \"" + localStorage["scandaloh_page_url"] +"\"></a>";

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

function scandaloh_response(){
    //TODO
}

function scandaloh_error(){
    //TODO
}

function send_scandaloh(){
    var scandaloh = Object();

    scandaloh.url = $('#page_url').text();
    if (editing_title){
        scandaloh.title = $("#edited_title").val();
    } else {
        scandaloh.title = $("#page_title").text();
    }

    //$('#page_url').text("Se envia " + scandaloh.title);
    //ajaxRequest(POST_SERVICES['send_scandaloh'], scandaloh, scandaloh_response, scandaloh_error)
    showNotification("Scandaloh enviado", "Creado nuevo scandaloh \"" + scandaloh.title +"\"" , "/images/scandaloh_48.png", 4000);
}