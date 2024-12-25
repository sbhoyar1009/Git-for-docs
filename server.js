

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const textRoutes = require('./routes/text');
const userRoutes = require('./routes/user');
const { fetchDocumentStatistics } = require('./controllers/textController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/text', textRoutes);
app.use('/api/user', userRoutes);
// Start the server

app.listen(5001, () => {
  console.log('Server is running on http://localhost:5001');

});
