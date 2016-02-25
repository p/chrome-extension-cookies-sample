// http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script
// http://stackoverflow.com/questions/9263671/google-chome-application-shortcut-how-to-auto-load-javascript/9310273#9310273

function injectScript(url, callback) {
  var s = document.createElement('script');
  var url = chrome.extension.getURL(url);
  s.src = url;
  (document.head||document.documentElement).appendChild(s);
  //alert(s);
  s.onload = function() {
  //alert(callback);
  //debugger;
    ///alert(window.$);
      s.parentNode.removeChild(s);
      if (callback) {
        callback.apply(this);
      }
  };
}

window.addEventListener("PassToBackground", function(evt) {
  chrome.runtime.sendMessage(evt.detail);
  //alert(evt.detail);
}, false);

injectScript('zepto.js', function() {
  injectScript('content.js');
});

//alert('in injector');
