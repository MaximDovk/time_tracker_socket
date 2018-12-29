const express = require('express')
const router = express.Router()
const HttpStatus = require('http-status-codes')
const {getServer} = require('../websocket')
const {send} = require('../utils/websocket')
const Message = require('../model/Message')
const MessageType = require('../constants/message-types')

router.post('/open', (req, res) => {
  const {url, macAddress} = req.body

  if (!url && !macAddress) {
    res.status(HttpStatus.BAD_REQUEST)

    return
  }

  const clients = Array.from(getServer().clients.values())
    .filter(socket => socket.initialized && socket.macAddress === macAddress)

  if (clients.length < 1) {
    res.status(HttpStatus.NOT_FOUND)
  }

  clients.forEach(socket => {
    send(socket, Message.create(MessageType.OPEN, {
      url
    }))
  })

  res.end()
})

module.exports = router
