const fg = require('fast-glob')
const path = require('path')

module.exports = class SocketIOHandlers {
  constructor (plasma, dna) {
    this.plasma = plasma
    this.dna = dna
    this.eventHandlersPromise = this.loadEventHandlers()
    if (dna.emitReady) {
      this.eventHandlersPromise.then(() => {
        plasma.emit(dna.emitReady)
      })
    }
    if (dna.reactOn) {
      let shape = dna.reactOn
      plasma.on(shape.type, (c) => {
        let socket = c[shape.propertyName]
        this.bindEventHandlers(socket)
      })
    }
  }

  async bindEventHandlers (socket) {
    this.eventHandlersPromise.then(function (handlers) {
      for (let eventName in handlers) {
        socket.on(eventName, handlers[eventName])
      }
    })
  }

  async loadEventHandlers () {
    let helpers = await this.loadEventHandlerHelpers()
    let entries = await fg(this.dna.basedir + this.dna.patterns)
    let handlers = {}
    entries.forEach((filepath) => {
      filepath = path.join(process.cwd(), filepath)
      let eventName = filepath.replace('.js', '')
        .replace(process.cwd() + path.sep, '')
        .replace(this.dna.basedir + path.sep, '')
      handlers[eventName] = require(filepath)(this.plasma, this.dna, helpers)
      if (this.dna.log) {
        console.info('[socketio-handlers]', eventName, '->', filepath)
      }
    })
    return handlers
  }

  async loadEventHandlerHelpers () {
    if (!this.dna.helpers) return {}
    let entries = await fg(this.dna.basedir + this.dna.helpers)
    let helpers = {}
    entries.forEach((filepath) => {
      filepath = path.join(process.cwd(), filepath)
      let helperName = filepath.replace('.js', '')
        .replace(process.cwd() + path.sep, '')
        .replace(this.dna.basedir + path.sep, '')
      helpers[helperName] = require(filepath)
      if (this.dna.log) {
        console.info('[socketio-handler-helpers]', helperName, '->', filepath)
      }
    })
    return helpers
  }
}
