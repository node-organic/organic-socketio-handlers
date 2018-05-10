const fg = require('fast-glob')
const path = require('path')

module.exports = class SocketIOHandlers {
  constructor (plasma, dna) {
    this.plasma = plasma
    this.dna = dna
    this.eventHandlerHelpers = null
    this.eventHandlers = null
    if (dna.reactOn) {
      plasma.on(dna.reactOn.type, (c) => {
        let socket = c[dna.reactOn.propertyName]
        this.bindEventHandlers(socket)
      })
    }
  }

  async bindEventHandlers (socket) {
    let handlers = await this.loadEventHandlers()
    for (let eventName in handlers) {
      socket.on(eventName, handlers[eventName])
    }
  }

  async loadEventHandlers () {
    if (this.eventHandlers) return this.eventHandlers
    let helpers = await this.loadEventHandlerHelpers()
    let entries = await fg(this.dna.basedir + this.dna.patterns)
    let handlers = this.eventHandlers = {}
    entries.forEach((filepath) => {
      filepath = path.join(process.cwd(), filepath)
      let eventName = filepath.replace('.js', '')
        .replace(process.cwd() + path.sep, '')
        .replace(this.dna.basedir + path.sep, '')
      handlers[eventName] = require(filepath)(this.plasma, this.dna, helpers)
    })
    return handlers
  }

  async loadEventHandlerHelpers () {
    if (!this.dna.helpers) return {}
    if (this.eventHandlerHelpers) return this.eventHandlerHelpers
    let entries = await fg(this.dna.basedir + this.dna.helpers)
    let helpers = this.eventHandlerHelpers = {}
    entries.forEach((filepath) => {
      filepath = path.join(process.cwd(), filepath)
      let eventName = filepath.replace('.js', '')
        .replace(process.cwd() + path.sep, '')
        .replace(this.dna.basedir + path.sep, '')
      helpers[eventName] = require(filepath)
    })
    return helpers
  }
}
