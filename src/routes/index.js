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

// @TODO Remove GET /open
router.get('/open', (req, res) => {
  const {url, macAddress} = req.query

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

router.get('/list', (req, res) => {
  const clients = Array.from(getServer().clients.values())

  res.send(JSON.stringify(clients.map(socket => ({
    macAddress: socket.macAddress,
    active: socket.initialized
  }))))
})

module.exports = router
