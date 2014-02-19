/**
 * Content Script to retrieve src from the most important image of the web
 */

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        console.log("Sending to Scandaloh");
        if (message.content == "bestFit"){
            ImageResolver.register(new FileExtensionResolver());
            ImageResolver.register(new OpengraphResolver());
            ImageResolver.register(new WebpageResolver());
            image_url = ImageResolver.directResolve(message.url, document);

            console.log("URL sent: " + image_url);
            sendResponse({'bestFit': image_url});

        } else {
            sendResponse(undefined);
        }
    }
)

