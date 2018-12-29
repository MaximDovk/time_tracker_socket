const send = (socket, message) => {
  socket.send(message.toString())
}

const broadcast = (server, message) => {
  server.clients.forEach((socket) => {
    socket.send(message.toString())
  })
}

module.exports = {
  send,
  broadcast
}
