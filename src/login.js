$(function(){
    $('#signin').click(start)
});

function show_error(message){
    $('#errors').css({'display':''})
    $('#error_text').text(message)
}

function clear_error(message){
    $('#errors').css({'display':'none'})
}

function start()
{
	user = document.getElementById("inputUser").value;
	password = document.getElementById("inputPassword").value;

    if (user == ""){
        show_error("Insert user")
    } else if (password == ""){
        show_error("Insert password")
    } else {
        chrome.extension.getBackgroundPage().login(user, password, false)
    }
    return false;
}


//TODO: BORRAR; NO HACE FALTA
if (localStorage.accessToken) {
    var graphUrl = "https://graph.facebook.com/me?" + localStorage.accessToken + "&callback=displayUser";
    console.log(graphUrl);

    var script = document.createElement("script");
    script.src = graphUrl;
    document.body.appendChild(script);

    function displayUser(user) {
        console.log(user);
    }
}
