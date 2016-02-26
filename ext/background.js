chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // if sender.tab is set, the message came from a content script;
    // otherwise, the message came from an extension(?)
    if (!sender.tab || sender.tab.url.indexOf('http://striker:8112') != 0) {
      return;
    }
    
    if (request.action == "getCookies")
      // Get cookies on the target domain;
      // this requires permissions to be appropriately configured.
      chrome.cookies.get({url:'http://localhost:8192/', name:'now'},
      
      // Get cookies on the host page's domain;
      // this does not require permission configuration.
      // If this call works but the localhost call above does not,
      // your permissions are not properly configured.
      //chrome.cookies.get({url:'http://striker:8112/', name:'now'},
        function(cookie) {
          alert([1,JSON.stringify(cookie),cookie.value])
          sendResponse({cookieValue: cookie.value});
      })
  }
);
