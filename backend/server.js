const express = require('express');
   const cors = require('cors');
   require('dotenv').config();

   const app = express();
   app.use(cors());
   app.use(express.json());

   app.get('/', (req, res) => {
     res.send('AI Code Review Assistant backend is running!');
   });

   const authRoutes = require('./routes/auth');
   app.use('/api/auth', authRoutes);

   const projectRoutes = require('./routes/projects');
   app.use('/api/projects', projectRoutes);

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server running on http://localhost:${PORT}`);
   });