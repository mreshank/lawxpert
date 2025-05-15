const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors({
  origin: ['https://lawexpert.vercel.app', 'http://localhost:5173', "*"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
const MONGO_URI = process.env.CONNECTION_STRING;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// API routes - these will be mounted under /api
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Root route for health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'LawXpert Express API is running' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));
