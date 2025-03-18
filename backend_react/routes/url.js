const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

const db = require('../config/db');
const jwtAuth = require('../middleware/jwtAuth');
const { urlLogger, buildLogData } = require('../config/winston');

const { generateUrl, generatePersonalizedUrl } = require('../utils/helpers');
const { urlPattern, personalizedUrlPattern, nameUrlPattern } = require('../utils/patterns');

const router = express.Router();



router.post('/create', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/create');
    const { redirectUrl, personalizedUrl, urlName, expirationDate, password } = req.body;
    if (!redirectUrl || !urlPattern.test(redirectUrl)) {
        urlLogger.warn(`User didn't provide valid redirect URL`, logData);
        return res.status(400).json({ status: false, message: 'Invalid or missing redirect URL' });
    }
    if (urlName && !nameUrlPattern.test(urlName)) {
        urlLogger.warn(`User didn't provide valid URL name`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid URL name' });
    }
    if (personalizedUrl && !personalizedUrlPattern.test(personalizedUrl)) {
        urlLogger.warn(`User didn't provide valid peronalized URL`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid personalized URL' });
    }
    const url = personalizedUrl ? generatePersonalizedUrl(personalizedUrl) : generateUrl();
    const columns = ['url', 'redirectUrl', 'userId'];
    const values = [url, redirectUrl, userId];
    if (urlName) columns.push('urlName'), values.push(urlName);
    if (expirationDate) columns.push('expirationDate'), values.push(expirationDate);
    if (password) columns.push('password'), values.push(bcrypt.hashSync(password, saltRounds));
    const query = `INSERT INTO url (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
    db.query(query, values, (err, rows) => {
        if (err?.code === 'ER_DUP_ENTRY') {
            urlLogger.error(`Error inserting new URL, url already exists`, logData);
            return res.status(400).json({ status: false, message: 'This URL already exists' });
        }
        if (err || rows?.affectedRows !== 1) {
            urlLogger.error(`Error inserting new URL`, logData);
            return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
        }
        urlLogger.info(`New URL created successfully`, logData);
        return res.status(201).json({ status: true, message: 'New URL created, redirection...' });
    });
});



router.post('/verifyPersonalizedUrl', jwtAuth, (req, res) => {
    const { userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/verifyPersonalizedUrl');
    const { personalizedUrl } = req.body;
    if (!personalizedUrl) {
        urlLogger.warn(`User didn't provide peronalized URL`, logData);
        return res.status(400).json({ status: false });
    }
    if (!personalizedUrlPattern.test(personalizedUrl)) {
        urlLogger.warn(`User didn't provide valid peronalized URL`, logData);
        return res.json({ status: true, available: false });
    }
    db.query(`SELECT url FROM url WHERE url = (?)`, [personalizedUrl], (err, row) => {
        if (err) {
            urlLogger.error(`Error selecting peronalized URL`, logData);
            return res.status(500).json({ status: false });
        }
        if (row.length > 0) {
            urlLogger.info(`User personalize URL isn't available`, logData);
            return res.json({ status: true, available: false });
        } else {
            urlLogger.info(`User personalize URL is available`, logData);
            return res.json({ status: true, available: true });
        }
    });
});



router.get('/get/all', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/get/all');
    db.query(`SELECT u.id, url, redirectUrl, urlName, expirationDate, creationDate, COUNT(*) AS redirectionCount FROM url u LEFT JOIN statistics s ON u.id = s.urlId WHERE userId = (?) GROUP BY u.id`, [userId], (err, rows) => {
        if (err) {
            urlLogger.error(`Error selecting URL rows`, logData);
            return res.status(500).json({ status: false });
        }
        urlLogger.info(`User URL rows sent successfully`, logData);
        return res.json({ status: true, data: rows });
    });
});



router.get('/get/verify/:urlId', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/get/verify');
    const { urlId } = req.params;
    if (!urlId) {
        urlLogger.warn(`User didn't provide URL ID`, logData);
        return res.status(400).json({ status: false });
    }
    db.query(`SELECT * FROM url WHERE userId = (?) AND id = (?)`, [userId, urlId], (err, rows) => {
        if (err || !rows || rows.length !== 1) {
            urlLogger.error(`Error selecting User URL row`, logData);
            return res.status(500).json({ status: false });
        }
        urlLogger.info(`User URL row sent successfully`, logData);
        return res.json({ status: true, data: rows[0] });
    });
});



router.get('/get/statistics/totalRedirections/:urlId', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/get/statistics/totalRedirections');
    const { urlId } = req.params;
    if (!urlId) {
        urlLogger.warn(`User didn't provide URL ID`, logData);
        return res.status(400).json({ status: false });
    }
    db.query(`SELECT COUNT(*) AS totalRedirection FROM statistics s LEFT JOIN url u ON s.urlId = u.id WHERE u.userId = (?) AND u.id = (?) GROUP BY urlId, userId`, [userId, urlId], (err, rows) => {
        if (err || !rows || rows.length !== 1) {
            urlLogger.error(`Error selecting User URL row`, logData);
            return res.status(500).json({ status: false });
        }
        const data = rows[0]?.totalRedirection || 0;
        urlLogger.info(`User URL row sent successfully`, logData);
        return res.json({ status: true, data });
    });
});



router.get('/get/statistics/statisticsLastMonth/:urlId', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/get/statistics/statisticsLastMonth');
    const { urlId } = req.params;
    if (!urlId) {
        urlLogger.warn(`User didn't provide URL ID`, logData);
        return res.status(400).json({ status: false });
    }
    db.query(`SELECT DATE(s.date) AS day, COUNT(*) AS redirectionCount FROM url u LEFT JOIN statistics s ON u.id = s.urlId WHERE u.userId = (?) AND u.id = (?) AND s.date >= NOW() - INTERVAL 30 DAY GROUP BY DATE(s.date) ORDER BY day`, [userId, urlId], (err, rows) => {
        if (err || !rows || rows.length === 0) {
            urlLogger.error(`Error selecting User URL row`, logData);
            return res.status(500).json({ status: false });
        }
        urlLogger.info(`User URL row sent successfully`, logData);
        return res.json({ status: true, data: rows });
    });
});



router.put('/update/:urlId', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/update');
    const { urlId } = req.params;
    if (!urlId) {
        urlLogger.warn(`User didn't provide URL ID`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid URL ID' });
    }
    const { redirectUrl, personalizedUrl, urlName, expirationDate, password } = req.body;
    if (redirectUrl && !urlPattern.test(redirectUrl)) {
        urlLogger.warn(`User didn't provide valid redirect URL`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid redirect URL' });
    }
    if (urlName && !nameUrlPattern.test(urlName)) {
        urlLogger.warn(`User didn't provide valid URL name`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid URL name' });
    }
    if (personalizedUrl && !personalizedUrlPattern.test(personalizedUrl)) {
        urlLogger.warn(`User didn't provide valid personalize URL`, logData);
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
        urlLogger.warn(`User didn't provide data to update`, logData);
        return res.status(400).json({ status: false, message: 'No data provided to update' });
    }
    const query = `UPDATE url SET ${columns.join(', ')} WHERE id = (?) AND userId = (?)`;
    values.push(urlId, userId);
    db.query(query, values, (err, rows) => {
        if (err || rows?.affectedRows !== 1) {
            urlLogger.error(`Error updating user URL`, logData);
            return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
        }
        urlLogger.info(`User URL updated successfully`, logData);
        return res.status(201).json({ status: true, message: 'URL updated, redirection...' });
    });
});



router.delete('/delete/:urlId', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/delete');
    const { urlId } = req.params;
    if (!urlId) {
        urlLogger.warn(`User didn't provide URL ID`, logData);
        return res.status(400).json({ status: false, message: 'Please provide a valid URL ID' });
    }
    db.query(`DELETE FROM url WHERE id = (?) AND userId = (?)`, [urlId, userId], (err, rows) => {
        if (err || rows?.affectedRows !== 1) {
            urlLogger.error(`Error deleting user URL`, logData);
            return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
        }
        urlLogger.info(`User URL deleted successfully`, logData);
        return res.json({ status: true, message: 'URL deleted, redirection...' });
    });
});



module.exports = router;