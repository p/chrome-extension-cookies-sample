//alert('in background');

/*
window.addEventListener("PassToBackground", function(evt) {
  chrome.runtime.sendMessage(evt.detail);
  //alert(evt.detail);
}, false);
*/

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  alert(sender.tab.url)
    //debugger;
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
                alert(2)
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
      chrome.cookies.get({url:'http://localhost:8192/', name:'now'},
      //chrome.cookies.get({url:'http://striker:8112/', name:'now'},
        function(cookie) {
          alert([1,JSON.stringify(cookie),cookie.value])
      })
  });
