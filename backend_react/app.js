// Import
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.REACT_APP_BACKEND_PORT || 3001;



// Middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    res.status(500).send('An internal server error occurred');
});



// Routes
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/url', urlRoutes);
app.use('/api', apiRoutes);



// Start
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



module.exports = app;