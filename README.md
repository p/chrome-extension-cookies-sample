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
