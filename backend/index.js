// backend/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js Backend');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
