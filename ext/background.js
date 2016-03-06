var allowedRemoteUrls = [
  // Chrome disallows setting Cookie header on requests to localhost,
  // hence the target here must be aliased if running all code locally.
  // http://stackoverflow.com/questions/11182712/refused-to-set-unsafe-header-origin-when-using-xmlhttprequest-of-google-chrome
  'http://faketarget:8192/',
];
var allowedHostUrls = [
  'http://fakehost:8112',
];

function cookieRetriever(request, sender, sendResponse) {
  // if sender.tab is set, the message came from a content script;
  // otherwise, the message came from an extension(?)
  if (!sender.tab) {
    return;
  }

  var hostOk = false;
  for (var i = 0; i < allowedHostUrls.length; ++i) {
    if (sender.tab.url.indexOf(allowedHostUrls[0]) === 0) {
      hostOk = true;
      break;
    }
  }
  if (!hostOk) {
    return;
  }

  if (request.action == "getCookies") {
    var url = request.url;
    var urlOk = false;
    for (var i = 0; i < allowedRemoteUrls.length; ++i) {
      if (url === allowedRemoteUrls[i]) {
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
    // If this call works but the fakehost call does not,
    // your permissions are not properly configured.
    //chrome.cookies.get({url: 'http://faketarget:8112', name: request.cookieName},
      function(cookie) {
        sendResponse({
          cookieName: request.cookieName,
          cookieValue: cookie && cookie.value,
          callbackKey: request.callbackKey,
        });
    })

    // http://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
    return true;
  } else {
    alert(JSON.stringify(request))
  }
}

//chrome.runtime.onMessage.addListener(cookieRetriever);
