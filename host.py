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
        
    with open('host.html') as f:
        content = f.read()
    return content % dict(status=status)

@app.route('/status')
def status():
    if 'now' in bottle.request.cookies:
        status = 'Cookie is set: %s' % bottle.request.cookies['now']
    else:
        status = 'Cookie is not set'
        
    bottle.response.content_type = 'text/plain'
    return status

app.run(port=8112, host='0.0.0.0')
