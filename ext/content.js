//alert('in content');
//alert(document.cookie);
//alert(jQuery);

var message = {hello:'world'};
var event = new CustomEvent("PassToBackground", {detail: message});
a=window.dispatchEvent(event);
alert(a)

$.ajax({url: 'http://localhost:8192/status', success: function(data, status, xhr) {
  //alert(data)
  //debugger;
}});
