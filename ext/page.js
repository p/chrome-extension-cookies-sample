window.addEventListener("PassToPage", function(evt) {
  var detail = evt.detail;
  if (detail.action == 'gotCookies') {
    $('#localhost-cookie').text('localhost cookie: ' + detail.cookieName + '=' + detail.cookieValue);
  }
});

var message = {action: 'getCookies', url: 'http://striker:8112/', cookieName: 'now'};
var event = new CustomEvent("PassToBackground", {detail: message});
window.dispatchEvent(event);

$.ajax({url: 'http://localhost:8192/status', success: function(data, status, xhr) {
  //alert(data)
  //debugger;
}});
