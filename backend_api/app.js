// Import
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config({ path: '../backend_react/.env' });

const app = express();
const PORT = process.env.BACKEND_API_PORT || 3002;

const urlRoutes = require('./routes/url');
const apiRoutes = require('./routes/api');


// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    res.status(500).send('An internal server error occurred');
});



// Routes
app.use('/', urlRoutes);
app.use('/api', apiRoutes);



// Start
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



module.exports = app;