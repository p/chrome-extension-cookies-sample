#!/usr/bin/env python

import time as _time
import bottle

app = bottle.Bottle()
app.debug = True

@app.route('/')
def index():
    if 'now' in bottle.request.cookies:
        status = 'Cookie is set: %s' % bottle.request.cookies['now']
    else:
        status = 'Cookie is not set'
        
    return '<html><body><p>%s</p><p><a href="/set-cookie">Set cookie</a></p></body></html>' % status

@app.route('/status')
def status():
    if 'now' in bottle.request.cookies:
        status = 'Cookie is set: %s' % bottle.request.cookies['now']
    else:
        status = 'Cookie is not set'
        
    bottle.response.content_type = 'text/plain'
    # no trailing slash below, unlike URLs given in
    # Chrome extension configuration
    bottle.response.set_header('access-control-allow-origin', 'http://fakehost:8112')
    return status

@app.route('/set-cookie')
def set_cookie():
    bottle.response.set_cookie('now', str(int(_time.time())))
    bottle.redirect('/')

app.run(port=8192, host='0.0.0.0')
