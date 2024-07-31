import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: ['http://128.113.230.166:3000'],
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://128.113.230.166:3000'], 
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const clients = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('setUsername', (username) => {
    clients[socket.id] = { username, socket };
    console.log(`Client connected: ${socket.id}, Username: ${username}`);
  });

  socket.on('sendMessage', (message) => {
    const user = clients[socket.id];
    if (user) {
      const fullMessage = {
        username: user.username,
        message: message
      };
      const jsonString = JSON.stringify(fullMessage);
      io.emit('receiveMessage', jsonString);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    const user = clients[socket.id];
    if (user) {
      const disconnectMessage = JSON.stringify({
        username: user.username,
        message: 'has disconnected'
      });
      socket.broadcast.emit('clientDisconnected', disconnectMessage);
    }
    delete clients[socket.id]; // Remove the client from the dictionary
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
