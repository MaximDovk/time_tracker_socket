const Message = require('../model/Message')
const ErrorType = require('../constants/errors')
const MessageType = require('../constants/message-types')
const {send} = require('../utils/websocket')

const messageHandlers = {
  [MessageType.CLIENT_INIT]: (socket, payload) => {
    socket.macAddress = payload.macAddress
    socket.initialized = !!payload.macAddress
  },
  [MessageType.CLIENT_ECHO]: (socket, payload) => {
    send(socket, Message.create(MessageType.ECHO, payload))
  },
}

const handler = (socket, server) => (messageString) => {
  try {
    const message = Message.fromString(messageString)

    const messageHandler = messageHandlers[message.type]

    if (!messageHandler) {
      send(socket, Message.create(MessageType.HANDLER_NOT_FOUND, `Handler for type ${message.type} not found`))

      return
    }

    messageHandler(socket, message.payload, server)
  } catch (e) {
    if (e.code === ErrorType.MESSAGE_FORMAT) {
      send(socket, Message.create(MessageType.FORMAT_ERROR, e.message))

      return
    }

    throw e
  }
}

module.exports = handler
