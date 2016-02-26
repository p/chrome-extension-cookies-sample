var message = {action: 'getCookies'};
var event = new CustomEvent("PassToBackground", {detail: message});
window.dispatchEvent(event);

$.ajax({url: 'http://localhost:8192/status', success: function(data, status, xhr) {
  //alert(data)
  //debugger;
}});
