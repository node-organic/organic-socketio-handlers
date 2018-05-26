const SocketIOHandlers = require('../index')
const Plasma = require('organic-plasma')
const Server = require('socket.io')
const Client = require('socket.io-client')

test('loaded handlers respond on events via socket.io', async (done) => {
  let plasma = new Plasma()
  let dna = {
    basedir: '__test__/handlers',
    patterns: ['/**/*.js'],
    reactOn: {
      type: 'connection',
      propertyName: 'socket'
    },
    emitReady: 'ready'
  }
  let instance = new SocketIOHandlers(plasma, dna)
  expect(instance).toBeDefined()
  let server = require('http').createServer(function (req, res) {})
  let ioserver = new Server(server)
  ioserver.on('connection', function (socket) {
    plasma.emit({
      type: 'connection',
      socket: socket
    })
  })
  server.listen(3000)
  plasma.on('ready', function () {
    let ioclient = new Client('http://localhost:3000', {
      transports: ['websocket']
    })
    ioclient.on('connect', async function () {
      ioclient.emit('ping2', {}, function (err, result) {
        if (err) return done(err)
        expect(result).toBe('pong2')
        ioclient.close()
        server.close()
        done()
      })
    })
  })
})
