$(function() {

    // For sending scandalohs with right-click in an image
    chrome.contextMenus.create({
        "id": "scandaloh_base",
        "title": "Send to Scandaloh!",
        "contexts": ["image", "video"],
        "onclick": menuClickCallback
    });

    localStorage["logged"] = false;

    // Add listener to detect facebook login
    chrome.tabs.onUpdated.addListener(onFacebookLogin);
  });

/**
 * Listener to cheeck if facebook login has been made from the plugin
 */
function onFacebookLogin() {
    var SUCCESS_URL = 'https://www.facebook.com/connect/login_success.html';

    chrome.tabs.getAllInWindow(null, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].url.indexOf(SUCCESS_URL) == 0) {
                var params = tabs[i].url.split('#')[1];
                accessToken = params.split('&')[0].split('=')[1];

                localStorage['fb_logged'] = true;

                loginWithFb(accessToken);

                chrome.tabs.onUpdated.removeListener(onFacebookLogin);
                chrome.tabs.remove(tabs[i].id);
                return;
            }
        }
    });
}

/**
 * Common tasks upon logging
 */
function setLogged() {

    localStorage['logged'] = true;

    chrome.browserAction.onClicked.addListener(sendPage)
    closeChromePopup();
    chrome.browserAction.setBadgeText({'text': '>>'})
    chrome.browserAction.setBadgeBackgroundColor({'color': 'red'})
    chrome.browserAction.setPopup({'popup': ""})
    showNotification("Logueado", "Se ha conectado con el servidor de Scandaloh!",
        "/images/scandaloh_48.png", 4000);

}

/**
 * Correct response from server
 * @param response
 */
function loginResponse(response){

    if (response.status == "ok"){
        setLogged();
    } else if (response.status == 'error') {
        showErrorOnPopup(response.reason);
    }
}

/**
 * Erroneous response from server (could be timeout or server unreachable)
 * @param response
 * @param status
 * @param err
 */
function loginErr(response, status, err){
    if (status == 'timeout'){
        showErrorOnPopup("Timeout error");
    } else {
        showErrorOnPopup("Server error");
    }
}

/**
 * Login function after a Facebook access token has been retrieved
 * @param accessToken
 */
function loginWithFb(accessToken){
    var loginObject = new Object();
    loginObject.access_token = accessToken;
    loginObject.social_network = 1;
    ajaxRequest(POST_SERVICES['login'], loginObject, loginResponse, loginErr);
}

/**
 * Standard manual login, called from login.js
 * @param username
 * @param password
 */
function login(username, password) {

    var loginObject = new Object();
    loginObject.username_email = username;
    loginObject.password = password;

    localStorage['user'] = username;
    ajaxRequest(POST_SERVICES['login'], loginObject, loginResponse, loginErr);

}

/**
 * Callback for sending page clicking in an image and selecting Scandaloh action
 * @param clickData
 */
function menuClickCallback(clickData){

    if (localStorage['logged'] == "true"){
        chrome.tabs.query({'active': true, 'currentWindow': true}, function(tabs) {
            localStorage["scandaloh_page_url"] = tabs[0].url;
            localStorage["scandaloh_page_title"] = tabs[0].title;
            localStorage["scandaloh_image_url"] = clickData.srcUrl;
            chrome.tabs.create({url: 'html/sendpage.html'});
        });
    } else {
        showNotification("Scandaloh","Tienes que estar logueado para enviar el scandaloh",
            "/images/scandaloh_48.png");
    }
}

/**
 * Send page to Scandaloh from extension icon on Action bar
 */
function sendPage(){

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {'content': "bestFit", 'url': tabs[0].url}, function(response) {
            localStorage["scandaloh_page_url"] = tabs[0].url;
            localStorage["scandaloh_page_title"] = tabs[0].title;
            localStorage["scandaloh_image_url"] = response.bestFit;
            chrome.tabs.create({url: 'html/sendpage.html'});
        });
    });
}