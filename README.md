# Chrome Sample Cookie Use Extension

This extension demonstrates reading cookies from a website from a Chrome
extension.

One use case which seemingly requires reading cookies is performing
XMLHttpRequest calls from one website to another, for example to present
data from the second website to the first website. It appears that if
such a request is initiated from an extension then despite the browser
having cookies for the target site, these cookies are not passed with
the XHR automatically. Setting these cookies on an XHR object manually
requires manually obtaining said cookies, which is the process this sample
extension covers.

## Mechanism

As explained [here](http://stackoverflow.com/questions/26140443/executing-code-at-page-level-from-background-js-and-returning-the-value/26141393#26141393)
a Chrome extension has 3 execution contexts: content, page and background.
The extension code normally runs in either the page context or the content
context, and cookies can only be read from the background context.
As such the page context passes a custom event to the content context
which sends a Chrome message to the background context; code in the background
context listens for Chrome messages, reads cookies and replies to the
messages with cookie values; code in the content context receives the reply
from the background context and forwards the data via another custom
event to the page context.

It seems possible to move some or all of the code which runs in the page
context to the content context, in which case half of the message passing
will cease to be necessary.

## Step By Step

Let's build the Chrome extension!

### Backend

In order to demonstrate the extension we need two Web sites on different
domains. To this end there are two Python scripts in this repository:

- `host.py` is the "host" Web page. It runs on port 8112 and I reference
this site via a `/etc/hosts` alias striker as follows: http://striker:8112/.
- `server.py` is the "remote" Web page.It runs on port 8192 and I reference
this site as http://localhost:8192/.

Both servers can set a cookie named `now`. Initially the cookie is not set.
Go to http://localhost:8192/ and click "Set cookie" - you will have
the cookie set on `localhost` but not on `striker`. If you go to
http://localhost:8112/ the cookie will be set - the cookie is bound to
the hostname, not to port, which is why we need two separate hostnames.

### Install The Extension

Next, install the extension in this repository via "Load unpacked extension"
method.

### Page To Content: Custom Event

The cookie retrieval is triggered when the host page loads.
In the page context we create a custom event containing the action
we want our background code to perform (`getCookies`), the URL
to retrieve the cookies for and the name of the cookie to retrieve.
This event is then dispatched:

    // our payoad
    var message = {
      action: 'getCookies',
      url: 'http://localhost:8192/',
      cookieName: 'now',
    };
    var event = new CustomEvent("PassToBackground", {detail: message});
    window.dispatchEvent(event);

Content script listens for this event and forwards it to the background
context:

    window.addEventListener("PassToBackground", function(evt) {
      // evt.detail has our message/payload
      chrome.runtime.sendMessage(evt.detail, function(response) {
        // handle response from background context - will write later
      });
    }, false);

Page and content scripts both have access to the page's DOM including the
window object and events, hence these scripts are able to communicate
by passing custom events between each other.

### Content To Background: Chrome Messaging

As shown above, the content code uses [chrome.runtime.sendMessage](https://developer.chrome.com/extensions/messaging#simple)
API to send an event to the background code:

      chrome.runtime.sendMessage(evt.detail, function(response) {
        // handle response from background context - will write later
      });

The background code listens for this event and reads the cookies:

    // listen for sendMessage events
    chrome.runtime.onMessage.addListener(
      // our event handler
      function(request, sender, sendResponse) {
        if (request.action == "getCookies") {
          // handle the event.
          // request has our message/payload.
          // perform security checks here, then do the work.
          // call sendResponse when done.
          // if sendResponse is called asynchronously,
          // this event handler must return true
        }
      }
    );

### Reading Cookies

We need to send something back, hence let's read the cookies on the target
site. This is easy:

    if (request.action == "getCookies") {
      chrome.cookies.get({url: request.url, name: request.cookieName},
        function(cookie) {
          // return the cookie to content context
          sendResponse({
            cookieName: request.cookieName,
            cookieValue: cookie && cookie.value,
          });
      })
      // cookie retrieval is asynchronous, event handler must return true
      return true;
    }

The important point here is that cookie retrieval is asynchronous -


## Resources

Chrome's 3 layers (content, page and background):
- http://stackoverflow.com/questions/26140443/executing-code-at-page-level-from-background-js-and-returning-the-value/26141393#26141393

Passing a message from page context to content context:
- https://stackoverflow.com/questions/25838804/gmail-extension-sendmessage-to-background-from-page-context/25847017#25847017
- http://stackoverflow.com/questions/9417121/is-there-any-way-of-passing-additional-data-via-custom-events

Passing a message from content context to background context:
- http://stackoverflow.com/questions/26140443/executing-code-at-page-level-from-background-js-and-returning-the-value/26141393#26141393
- https://developer.chrome.com/extensions/messaging#simple
  chrome.runtime.onMessage.addListener example

Specifics on reading cookies:
- http://stackoverflow.com/questions/5892176/getting-cookies-in-a-google-chrome-extension
- https://developer.chrome.com/extensions/cookies#method-get
- Check that permissions are set properly (http vs https etc.)
