const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Import path module

const authRoutes = require('./routes/authRoutes'); 
const progressRoutes = require('./routes/progressRoutes');
const courseRoutes = require('./routes/courses');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: '*', 
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/courses', courseRoutes);

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Serve React app for all other routes
app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
