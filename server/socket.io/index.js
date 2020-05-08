const socketIo = require('socket.io');

const io = {
  io: null,
  activeSockets: {},
  init: function (server) {
    this.io = socketIo(server)
  }
};

module.exports = io;
