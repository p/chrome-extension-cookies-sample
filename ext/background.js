var allowedUrls = [
  'http://localhost:8192/',
];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // if sender.tab is set, the message came from a content script;
    // otherwise, the message came from an extension(?)
    if (!sender.tab || sender.tab.url.indexOf('http://striker:8112') != 0) {
      return;
    }
    
    if (request.action == "getCookies")
      var url = request.url;
      var urlOk = false;
      for (var i = 0; i < allowedUrls.length; ++i) {
        if (url === allowedUrls[i]) {
          urlOk = true;
          break;
        }
      }
      if (!urlOk) {
        return;
      }
      
      // Get cookies on the target domain;
      // this requires permissions to be appropriately configured.
      chrome.cookies.get({url: url, name: request.cookieName},
      
      // Get cookies on the host page's domain;
      // this does not require permission configuration.
      // If this call works but the localhost call above does not,
      // your permissions are not properly configured.
      //chrome.cookies.get({url: 'http://striker:8112', name: request.cookieName},
        function(cookie) {
          sendResponse({cookieName: request.cookieName, cookieValue: cookie && cookie.value});
      })
      
    // http://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
    return true;
  }
);
