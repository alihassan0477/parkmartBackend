const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

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

app.use('/', authRoutes);
app.use('/', sellerRoutes);
app.use('/', productRoutes);
app.use('/', categoryRoutes);
app.use('/', RFQRoutes);
app.use('/', reviewRoutes);

// Socket.IO events
io.on('connection', (socket) => {
  console.log('Connected');
});

// MongoDB connection and server start
mongoose
  .connect(
    'mongodb+srv://usamahabib17147714:Uu112233..@pakmart.r5ph9.mongodb.net/?retryWrites=true&w=majority&appName=pakmart'
  )
  .then(() => {
    console.log('Connected to Database');
    server.listen(2000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Connection Failed:', error);
  });
