const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. Import Routes
const authRoutes = require('./routes/authRoutes');

const app = express();

// 2. Middlewares
app.use(cors());
app.use(express.json()); // Essential for parsing incoming JSON bodies

// 3. API Routes
app.get('/', (req, res) => {
    res.send('LisheSafi Zero-Knowledge API is running...');
});

app.use('/api/auth', authRoutes);

// 4. Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lishesafi';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('Database connection error:', err));

// 5. Start Server (Keep app.listen at the very end!)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});