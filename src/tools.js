/**
 * Tools.js
 * Date: 11/12/13
 * Support functions for plugin
 */

/**
 * POST Request to Scandaloh server
 * @param service - Name of the service to use
 * @param data - Data to send
 * @param callback_ok - run if the return is ok
 * @param callback_err - run upon error
 */
function ajaxRequest(service, data, callback_ok, callback_err){
    $.ajax({
        url: SCANDALOH_SERVER_URL + service,
        type: 'post',
        data: JSON.stringify(data),
        timeout: 15000,
        headers: {"Content-Type": "application/json; charset=utf-8"}
    }).done(callback_ok).fail(callback_err);
}

/**
 * Filters unnecessary tags in the html code
 * @param htmlCode
 * @param tag - Tag to remove from html code
 * @returns {String} Filtered html code
 */
function filterHTML(htmlCode, tag) {

    var re = new RegExp("<" + tag + "[\\s\\S]*?<\\/" + tag + ">", "gi")
    return htmlCode.replace(re, "")

}

/**
 * Given an url, determines if the page should be processed by the plugin
 * @param url
 * @returns {boolean}
 */
function isValidUrl(url) {
    return (url.indexOf("chrome://") == -1 &&
        url.indexOf("chrome-devtools://") == -1 &&
        url.indexOf("localhost:") == -1 &&
        url.indexOf("127.0.0.1") == -1 &&
        url.slice(-4) != ".pdf")
}

/**
 * Shows a Chrome notification
 * @param title
 * @param text
 * @param image
 * @param show_time
 */
function showNotification(title, text, image, show_time){

    var notification = new Notification(title, {body: text, icon: image});
    window.setTimeout(function(){
        notification.close();
    }, 4000);
}

/**
 * Closes the Chrome popup window if opened
 */
function closeChromePopup(){

    popups = chrome.extension.getViews({type:'popup'});
    if (popups.length > 0){
        popups[0].close();
    }
}

/**
 * Sets the error in the popup window from any other page
 * @param message
 * @returns {boolean} indicates whether the popup window is opened
 */
function showErrorOnPopup(message){

    popups = chrome.extension.getViews({type:'popup'});
    if (popups.length > 0){
        popups[0].show_error(message);
        return true;
    }
    return false;
}

/**
 * Getes domain from a url
 * @param url
 * @returns hostname
 */
function getUrlDomain(url) {
  var    a      = document.createElement('a');
         a.href = url;
  return a.hostname;
}
