const express = require('express');

const db = require('../config/db');
const jwtAuth = require('../middleware/jwtAuth');
const { apiLogger, buildLogData } = require('../config/winston');

const { generateApiKey, hashApiKey, sendApiKeyEmail } = require('../utils/helpers');

const router = express.Router();



router.get('/infos', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/infos');
    db.query(`SELECT firstChars, creationDate, numberOfUses, lastTimeUsed FROM api_keys WHERE userId = (?)`, [userId], (err, rows) => {
        if (err) {
            apiLogger.error(`Error selecting user API key infos`, logData);
            return res.status(500).json({ status: false, message: 'An error has occurred, please try again later' });
        }
        if (!rows || rows.length !== 1) {
            apiLogger.info(`User doesn't has an API key`, logData);
            return res.json({ status: true, data: null });
        }
        apiLogger.info(`User has an API key and info sent successfully`, logData);
        return res.json({ status: true, data: rows[0] });
    });
});



router.post('/create', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/create');
    const apiKey = generateApiKey();
    const hashedApiKey = hashApiKey(apiKey);
    const firstChars = apiKey.slice(0,10);
    db.query(`INSERT INTO api_keys (apiKey, firstChars, userId) VALUES (?, ?, ?)`, [hashedApiKey, firstChars, userId], (err, rows) => {
        if (err || rows?.affectedRows !== 1) {
            apiLogger.error(`Error inserting user API key`, logData);
            return res.status(400).json({ status: false, message: 'An error has occurred, please try again later' });
        }
        sendApiKeyEmail(userEmail, apiKey);
        apiLogger.info(`API key created successfully`, logData);
        return res.status(201).json({ status: true, message: 'API key created and sent to your email' });
    });
});



module.exports = router;