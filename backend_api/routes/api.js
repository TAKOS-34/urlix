const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

const db = require('../config/db');
const auth = require('../middleware/auth');
const { apiLogger, buildLogData } = require('../config/winston');

const { generateUrl, generatePersonalizedUrl } = require('../../backend_react/utils/helpers');
const { urlPattern, nameUrlPattern, personalizedUrlPattern } = require('../../backend_react/utils/patterns');

const router = express.Router();



router.post('/create', auth, (req, res) => {
    const { userId, userEmail, apiKey } = req.user;
    const logData = buildLogData(userEmail, req, '/create');
    const { redirectUrl, personalizedUrl, urlName, expirationDate, password } = req.body;
    if (!redirectUrl || !urlPattern.test(redirectUrl)) {
        apiLogger.warn(`User didn't provide valid redirect URL`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid redirect URL' });
    }
    if (urlName && !nameUrlPattern.test(urlName)) {
        apiLogger.warn(`User didn't provide valid URL name`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid URL name' });
    }
    if (personalizedUrl && !personalizedUrlPattern.test(personalizedUrl)) {
        apiLogger.warn(`User didn't provide valid personalize URL`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid personalized URL' });
    }
    const url = personalizedUrl ? generatePersonalizedUrl(personalizedUrl) : generateUrl();
    const columns = ['url', 'redirectUrl'];
    const values = [url, redirectUrl];
    if (urlName) columns.push('urlName'), values.push(urlName);
    if (expirationDate) columns.push('expirationDate'), values.push(expirationDate);
    if (password) columns.push('password'), values.push(bcrypt.hashSync(password, saltRounds));
    columns.push('userId'); values.push(userId);
    const query = `INSERT INTO url (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
    db.query(query, values, (err, rows) => {
        if (err || rows?.affectedRows === 0) {
            apiLogger.error(`Error inserting new URL`, logData);
            return res.status(500).json({ status: false, message: 'Internal server error' });
        }
        const data = {
            url,
            urlName: urlName || null,
            expirationDate: expirationDate || null,
            creationDate: new Date()
        };
        apiLogger.info(`New URL created successfully`, logData);
        res.status(201).json({ status: true, data });
        db.query(`UPDATE api_keys SET numberOfUses = numberOfUses + 1, lastTimeUsed = NOW() WHERE apiKey = (?)`, [apiKey], (err, rows) => {});
    });
});



router.get('/get/all', auth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/get/all');
    db.query(`SELECT u.id, url, redirectUrl, urlName, expirationDate, creationDate, COUNT(*) AS redirectionCount FROM url u LEFT JOIN statistics s ON u.id = s.urlId WHERE userId = (?) GROUP BY u.id`, [userId], (err, rows) => {
        if (err) {
            apiLogger.error(`Error selecting URL rows`, logData);
            return res.status(500).json({ status: false, message: 'Internal server error' });
        }
        apiLogger.info(`User URL rows sent successfully`, logData);
        return res.json({ status: true, data: rows });
    });
});



router.get('/get/id/:urlId', auth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/get/id');
    const { urlId } = req.params;
    if (!urlId) {
        apiLogger.warn(`User didn't provide URL ID`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid URL ID' });
    }
    db.query(`SELECT u.id, url, redirectUrl, urlName, expirationDate, creationDate, COUNT(*) AS redirectionCount FROM url u LEFT JOIN statistics s ON u.id = s.urlId WHERE userId = (?) AND u.id = (?)`, [userId, urlId], (err, rows) => {
        if (err) {
            apiLogger.error(`Error selecting User URL row`, logData);
            return res.status(500).json({ status: false, message: 'Internal server error' });
        }
        if (!rows || rows.length === 0 || rows[0]?.url === null) {
            apiLogger.error(`Error selecting User URL row, url doesn't exists or belong to user`, logData);
            return res.status(403).json({ status: false, message: 'This URL does not exist or does not belong to you' });
        }
        apiLogger.info(`User URL row sent successfully`, logData);
        return res.json({ status: true, data: rows[0] });
    });
});



router.get('/get/url', auth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/get/url');
    const { value } = req.query;
    if (!value || !urlPattern.test(value)) {
        apiLogger.warn(`User didn't provide a valid URL value`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid URL value' });
    }
    db.query(`SELECT u.id, url, redirectUrl, urlName, expirationDate, creationDate, COUNT(*) AS redirectionCount FROM url u LEFT JOIN statistics s ON u.id = s.urlId WHERE userId = (?) AND u.url = (?)`, [userId, value], (err, rows) => {
        if (err) {
            apiLogger.error(`Error selecting User URL row`, logData);
            return res.status(500).json({ status: false, message: 'Internal server error' });
        }
        if (!rows || rows.length === 0 || rows[0]?.url === null) {
            apiLogger.error(`Error selecting User URL row, url doesn't exists or belong to user`, logData);
            return res.status(403).json({ status: false, message: 'This URL does not exist or does not belong to you' });
        }
        apiLogger.info(`User URL row sent successfully`, logData);
        return res.json({ status: true, data: rows[0] });
    });
});



router.put('/update/:urlId', auth, (req, res) => {
    const { userId, userEmail, apiKey } = req.user;
    const logData = buildLogData(userEmail, req, '/update');
    const { urlId } = req.params;
    if (!urlId) {
        apiLogger.warn(`User didn't provide a valid URL ID`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid URL ID' });
    }
    const { redirectUrl, personalizedUrl, urlName, expirationDate, password } = req.body;
    if (redirectUrl && !urlPattern.test(redirectUrl)) {
        apiLogger.warn(`User didn't provide a valid redirect URL`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid redirect URL' });
    }
    if (urlName && !nameUrlPattern.test(urlName)) {
        apiLogger.warn(`User didn't provide a valid URL name`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid URL name' });
    }
    if (personalizedUrl && !personalizedUrlPattern.test(personalizedUrl)) {
        apiLogger.warn(`User didn't provide a valid personalize URL`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid personalized URL' });
    }
    const columns = [];
    const values = [];
    if (redirectUrl) columns.push('redirectUrl = (?)'), values.push(redirectUrl);
    if (personalizedUrl) columns.push('url = (?)'), values.push(personalizedUrl);
    if (urlName) columns.push('urlName = (?)'), values.push(urlName);
    if (expirationDate) columns.push('expirationDate = (?)'), values.push(expirationDate);
    if (password) columns.push('password = (?)'), values.push(bcrypt.hashSync(password, saltRounds));
    if (columns.length === 0) {
        apiLogger.warn(`User didn't provide data to update`, logData);
        return res.status(400).json({ status: false, message: 'No data provided to update' });
    }
    const query = `UPDATE url SET ${columns.join(', ')} WHERE id = (?) AND userId = (?)`;
    values.push(urlId, userId);
    db.query(query, values, (err, rows) => {
        if (err) {
            apiLogger.error(`Error updating user URL`, logData);
            return res.status(500).json({ status: false, message: 'Internal server error' });
        }
        if (rows?.affectedRows === 0) {
            apiLogger.error(`Error updating user URL, no changes were made`, logData);
            return res.status(400).json({ status: false, message: 'No changes were made' });
        }
        apiLogger.info(`User URL updated successfully`, logData);
        res.status(201).json({ status: true });
        db.query(`UPDATE api_keys SET numberOfUses = numberOfUses + 1, lastTimeUsed = NOW() WHERE apiKey = (?)`, [apiKey], (err, rows) => {});
    });
});



router.delete('/delete/:urlId', auth, (req, res) => {
    const { userId, userEmail, apiKey } = req.user;
    const logData = buildLogData(userEmail, req, '/delete');
    const { urlId } = req.params;
    if (!urlId) {
        apiLogger.warn(`User didn't provide a valid URL ID`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid URL ID' });
    }
    db.query(`DELETE FROM url WHERE id = (?) AND userId = (?)`, [urlId, userId], (err, rows) => {
        if (err) {
            apiLogger.error(`Error deleting user URL`, logData);
            return res.status(500).json({ status: false, message: 'Internal server error' });
        }
        if (rows?.affectedRows === 0) {
            apiLogger.error(`Error deleting user URL, no changes were made`, logData);
            return res.status(400).json({ status: false, message: 'No changes were made' });
        }
        apiLogger.info(`User URL deleted successfully`, logData);
        res.json({ status: true });
        db.query(`UPDATE api_keys SET numberOfUses = numberOfUses + 1, lastTimeUsed = NOW() WHERE apiKey = (?)`, [apiKey], (err, rows) => {});
    });
});



module.exports = router;