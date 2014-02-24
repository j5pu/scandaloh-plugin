$(function() {
    chrome.contextMenus.create({
        "id": "scandaloh_base",
        "title": "Send to Scandaloh!",
        "contexts": ["image", "video"],
        "onclick": menuClickCallback
    });

    localStorage["logged"] = false;
  });

function loginResponse(response){

    if (response.status == "ok"){

        localStorage['user_resource'] = response.user_uri;
        localStorage['logged'] = true;

        chrome.browserAction.onClicked.addListener(sendPage)

        closeChromePopup();
        chrome.browserAction.setBadgeText({'text': '>>'})
        chrome.browserAction.setBadgeBackgroundColor({'color': 'red'})
        chrome.browserAction.setPopup({'popup': ""})
        showNotification("Logueado", "Se ha conectado con el servidor de Scandaloh!", "/images/scandaloh_48.png", 4000);

    } else if (response.status == 'error') {
        showErrorOnPopup(response.reason);
    }
}

function loginErr(response, status, err){
    if (status == 'timeout'){
        showErrorOnPopup("Timeout error");
    } else {
        showErrorOnPopup("Server error");
    }
}

function login(username, password) {

    var login_token = new Object();
    login_token.username_email = username;
    login_token.password = password;
    //login_token.plugin_version = PLUGIN_VERSION;

    localStorage['user'] = username;
    ajaxRequest(POST_SERVICES['login'], login_token, loginResponse, loginErr);

}

function menuClickCallback(clickData){

    if (localStorage['logged'] == "true"){
        chrome.tabs.query({'active': true}, function(tabs) {
            localStorage["scandaloh_page_url"] = tabs[0].url;
            localStorage["scandaloh_page_title"] = tabs[0].title;
            localStorage["scandaloh_image_url"] = clickData.srcUrl;
            chrome.tabs.create({url: 'html/sendpage.html'});
        });
    } else {
        showNotification("Scandaloh","Tienes que estar logueado para enviar el scandaloh", "/images/scandaloh_48.png");
    }
}

function sendPage(){

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {'content': "bestFit", 'url': tabs[0].url}, function(response) {
    //chrome.tabs.query({'active': true}, function(tabs) {
            localStorage["scandaloh_page_url"] = tabs[0].url;
            localStorage["scandaloh_page_title"] = tabs[0].title;
            localStorage["scandaloh_image_url"] = response.bestFit;
            chrome.tabs.create({url: 'html/sendpage.html'});
        });
    });
}

function sendPageVisited(url)
{
	twitterMain = false;
	var xhr = new XMLHttpRequest();
	var urlRest = MNOPI_SERVER_URL + POST_SERVICES['sendPageVisited'];
	xhr.onreadystatechange = readResponse;
	xhr.open("POST", urlRest, true);
	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    var pageVisited = new Object();
    pageVisited.url = url;
    pageVisited.idUser = localStorage["email"];
    var postData = JSON.stringify(pageVisited);

    xhr.send(postData);
}

function readResponse() {
	if (this.readyState == 4) {
		if(this.status == 0) {
			throw('Status = 0');
		}
  		alerta = this.status+' '+statusCodes[this.status]+'</br>'+this.responseText;
  		//this.callback();
	}
}

function sendHtmlVisited(url)
{
	twitterMain = false;
	var request = new XMLHttpRequest();
	request.callback = function(){
		var xhr = new XMLHttpRequest();
		var urlRest = MNOPI_SERVER_URL + POST_SERVICES['sendHtmlVisited'];
		xhr.open("POST", urlRest, true);
		xhr.callback = function(){
			alert(decodeURI(alerta));
		};
		xhr.onreadystatechange = readResponse;
		xhr.setRequestHeader("Content-Type", "application/json");

        htmlCode = filterHTML(htmlCode, "script");
        htmlCode = filterHTML(htmlCode, "style");

        var htmlVisited = new Object();
        htmlVisited.url = url;
        htmlVisited.htmlString = htmlCode;
        htmlVisited.idUser = localStorage["email"];
        var postData = JSON.stringify(htmlVisited);
        xhr.send(postData);
	};
	request.open("GET", url, true); //TODO: quiza este get pueda apañarse
	request.send(null);
	request.onreadystatechange = readResponse2;
}

function readResponse2() {
  if (this.readyState == 4) {
      if(this.status == 0) {
        throw('Status = 0');
      }
	htmlCode = this.responseText; //aqui esta el html de la web --> hacer un post con este dato
	this.callback();
}
}

