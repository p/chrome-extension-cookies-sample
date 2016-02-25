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
