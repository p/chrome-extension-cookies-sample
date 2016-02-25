// http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script
// http://stackoverflow.com/questions/9263671/google-chome-application-shortcut-how-to-auto-load-javascript/9310273#9310273

var s = document.createElement('script');
var url = chrome.extension.getURL('content.js');
s.src = url;
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s);
};

alert('in injector');
