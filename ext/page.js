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

window.addEventListener("PassToPage", function(evt) {
  var detail = evt.detail;
  if (detail.action == 'gotCookies') {
    if (detail.callbackKey) {
      var callback = callbackRegistry[detail.callbackKey];
      detail.callbackKey = undefined;
      if (callback) {
        callbackRegistry[detail.callbackKey] = undefined;
        callback.call(null, detail);
      }
    }
  }
});

function passToBackground(message) {
  var callbackKey = generateUniqueKey();

  callbackRegistry[callbackKey] = message.callback;
  message.callback = undefined;
  message.callbackKey = callbackKey;

  var event = new CustomEvent("PassToBackground", {detail: message});
  window.dispatchEvent(event);
}

var message = {
  action: 'getCookies',
  url: 'http://faketarget:8192/',
  cookieName: 'now',
  callback: function(response) {
    var cookieText = response.cookieName + '=' + response.cookieValue;
    $('#target-cookie').text('target cookie: ' + cookieText);
    
    $.ajax({url: 'http://faketarget:8192/status',
      headers: {cookie: cookieText}, success: function(data, status, xhr) {
        alert(data);
    }});
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
