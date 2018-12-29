const WebSocket = require('ws')
const Message = require('./model/Message')
const MessageType = require('./constants/message-types')
const handler = require('./services/websocket')

let server = null

const TIMEOUT = 30000

const noop = () => {}

const init = (httpServer) => {
  if (!server) {
    server = new WebSocket.Server({
      server: httpServer
    })

    server.on('connection', (socket) => {
      socket.isAlive = true
      socket.on('message', handler(socket, server))
      socket.on('pong', () => socket.isAlive = true)

      socket.send(Message.create(MessageType.INIT).toString())
    })

    setInterval(() => {
      server.clients.forEach((socket) => {
        if (!socket.isAlive) {
          return socket.terminate()
        }

        socket.isAlive = false
        socket.ping(noop)
      })
    }, TIMEOUT)
  }

  return server
}

module.exports = {
  init,
  getServer: () => server
}
