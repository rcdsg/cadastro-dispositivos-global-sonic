let ioRef = null;
function initSocket(server) {
  const { Server } = require("socket.io");
  const io = new Server(server, {
    cors: { origin: "*" }
  });
  ioRef = io;

  io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);
    socket.on('disconnect', () => { /* optional */ });
  });

  return io;
}

function emit(event, payload) {
  if (!ioRef) return;
  ioRef.emit(event, payload);
}

module.exports = { initSocket, emit };
