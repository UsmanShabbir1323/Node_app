// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  // ✅ Only this app.listen, and include '0.0.0.0'
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
