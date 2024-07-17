const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const port = process.env.HTTP_PORT || 3000;
const mongoUrl = process.env.MONGO_URL;
const jwtSecret = process.env.JWT_SECRET;

if (!mongoUrl) {
  throw new Error('MONGO_URL is not defined');
}
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined');
}

console.log('HTTP_PORT:', port);
console.log('MONGO_URL:', mongoUrl);
console.log('JWT_SECRET:', jwtSecret);

mongoose.connect(mongoUrl);

app.use(express.json());

app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/advertisementRoutes'));
app.use('/api', require('./routes/chatRoutes'));

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = require('socket.io')(server);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('getHistory', async ({ receiverId }) => {
    try {
      const chat = await Chat.findOne({ users: { $all: [socket.user.id, receiverId] } });
      socket.emit('chatHistory', chat ? chat.messages : []);
    } catch (error) {
      socket.emit('error', 'Unable to fetch chat history');
    }
  });

  socket.on('sendMessage', async ({ receiverId, text }) => {
    try {
      const message = await Chat.sendMessage({ author: socket.user.id, receiver: receiverId, text });
      io.to(receiverId).emit('newMessage', message);
    } catch (error) {
      socket.emit('error', 'Unable to send message');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});