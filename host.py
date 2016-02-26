#!/usr/bin/env python

import bottle

app = bottle.Bottle()
app.debug = True

@app.route('/')
def index():
    if 'now' in bottle.request.cookies:
        status = 'Cookie is set: %s' % bottle.request.cookies['now']
    else:
        status = 'Cookie is not set'
        
    return '<html><body><p>%s</p><p><a href="/set-cookie">Set cookie</a></p><p id="localhost-cookie"></p></body></html>' % status

@app.route('/status')
def status():
    if 'now' in bottle.request.cookies:
        status = 'Cookie is set: %s' % bottle.request.cookies['now']
    else:
        status = 'Cookie is not set'
        
    bottle.response.content_type = 'text/plain'
    return status

app.run(port=8112)
