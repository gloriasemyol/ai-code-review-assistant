const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Route Imports
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const analysisRoutes = require('./routes/analysis');

// 2. Route Connections
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/analysis', analysisRoutes);

// Root test endpoint
app.get('/', (req, res) => {
  res.send('AI Code Review Assistant API is running...');
});

const reviewRoutes = require('./routes/reviews');
   app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});