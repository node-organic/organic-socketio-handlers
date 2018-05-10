# organic-socketio-handlers

Autoload socketio handlers (similar to [organic-express-routes](https://www.npmjs.com/package/organic-express-routes))
based on [organic-socketio-server](https://www.npmjs.com/package/organic-socketio-server)

## dna

```
{
  "basedir": String,
  "patterns": [String],
  "reactOn": {
    "type": String,
    "propertyName": String
  },
  "emitReady": String
}
```

## example with SocketIOServer

```
const Plasma = require('organic-plasma')
const SocketIOServer = require('organic-socketio-server')
const SocketIOHandlers = require('organic-socketio-handlers')

let plasma = new Plasma()
let server = new SocketIOServer(plasma, {
  port: 8787,
  emit: {
    connection: 'SocketIOConnection'
  }
})
let handlers = new SocketIOHandlers(plasma, {
  reactOn: 'SocketIOConnection'
})
```
