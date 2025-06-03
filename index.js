const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const Message = require('./Model/message_model');

// Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust origin to your frontend's URL in production
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authroutes');
const sellerRoutes = require('./routes/sellerRoutes');
const productRoutes = require('./routes/productroutes');
const categoryRoutes = require('./routes/categoryRoutes');
const RFQRoutes = require('./routes/RFQ');
const reviewRoutes = require('./routes/reviewRoutes');
const messageRoutes = require('./routes/chat_routes');

app.use('/', authRoutes);
app.use('/', sellerRoutes);
app.use('/', productRoutes);
app.use('/', categoryRoutes);
app.use('/', RFQRoutes);
app.use('/', reviewRoutes);
app.use('/', messageRoutes);

// Socket.IO events

// io.on('connection', (socket) => {
//   console.log('User connected');

//   socket.on('join', (userId) => {
//     console.log('Joined room:', userId);
//     socket.join(userId);

//     io.to(userId).emit('receive', 'hello my name is Shahzeel');
//   });
// });

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('send_message', async ({ senderId, receiverId, content }) => {
    console.log(senderId);
    console.log(receiverId);
    const message = new Message({ senderId, receiverId, content });
    await message.save();

    io.to(receiverId).emit('receive_message', message);
    io.to(senderId).emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// MongoDB connection and server start
mongoose
  .connect(
    'mongodb+srv://usamahabib17147714:Uu112233..@pakmart.r5ph9.mongodb.net/?retryWrites=true&w=majority&appName=pakmart'
  )
  .then(() => {
    console.log('Connected to Database');
    server.listen(2000, () => {
      console.log('Server is running on port 2000');
    });
  })
  .catch((error) => {
    console.error('Connection Failed:', error);
  });
