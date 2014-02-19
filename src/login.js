$(function(){
    $('#signin').click(start)
})

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