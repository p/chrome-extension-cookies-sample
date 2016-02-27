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
        callback.apply(null, detail);
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
  url: 'http://localhost:8192/',
  cookieName: 'now',
  callback: function(response) {
    $('#localhost-cookie').text('localhost cookie: ' + response.cookieName + '=' + response.cookieValue);
  },
};
passToBackground(message);

$.ajax({url: 'http://localhost:8192/status', success: function(data, status, xhr) {
  //alert(data)
  //debugger;
}});
