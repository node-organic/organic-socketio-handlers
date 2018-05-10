const SocketIOHandlers = require('../index')
const Plasma = require('organic-plasma')

test('loadEventHandlers', async () => {
  let plasma = new Plasma()
  let dna = {
    basedir: '__test__/handlers',
    patterns: ['/**/*.js']
  }
  let instance = new SocketIOHandlers(plasma, dna)
  let handlers = await instance.loadEventHandlers()
  expect(handlers['file']).toBeDefined()
  expect(handlers['inner/file']).toBeDefined()
})

test('loadEventHandlerHelpers', async () => {
  let plasma = new Plasma()
  let dna = {
    basedir: '__test__/handlers',
    helpers: '/**/*.js'
  }
  let instance = new SocketIOHandlers(plasma, dna)
  let helpers = await instance.loadEventHandlerHelpers()
  expect(helpers['file']).toBeDefined()
})
