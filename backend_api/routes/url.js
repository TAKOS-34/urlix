const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const geoip = require('geoip-lite');
const userAgent = require('user-agent');

const db = require('../config/db');
const { urlLogger, buildLogDataUrl } = require('../config/winston');

const router = express.Router();



router.get('/', (req, res) => {
    res.redirect(process.env.FRONTEND_URL);
});



router.get('/:url', (req, res) => {
    const url = `${process.env.BACKEND_API_URL}/${req.params.url}`;
    const logData = buildLogDataUrl(req, '/getUrl');
    db.query(`SELECT id, redirectUrl, password, expirationDate FROM url WHERE url = (?)`, [url], (err, rows) => {
        if (err) {
            urlLogger.error(`Error selecting URL`, logData);
            return res.status(500).send('An error occurred, please try again later');
        }
        if (!rows || rows.length !== 1) {
            urlLogger.warn(`URL doesn't exists`, logData);
            return res.status(404).send('No redirection found for this URL');
        }
        const urlInfos = rows[0];
        const expirationDate = urlInfos.expirationDate ? new Date(urlInfos.expirationDate) : null;
        if (expirationDate && expirationDate < new Date()) {
            urlLogger.warn(`URL has expired`, logData);
            return res.status(410).send('This URL has expired');
        }
        if (urlInfos.password) {
            urlLogger.info(`User is redirected to password form`, logData);
            return res.sendFile(path.join(__dirname, '../public/password.html'));
        }
        urlLogger.info(`User is redirected`, logData);
        res.status(302).redirect(urlInfos.redirectUrl);
        const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userCountry = geoip.lookup(userIp)?.country || null;
        const userAgentInfos = req.get('User-Agent');
        const parsedUserAgent = userAgent.parse(userAgentInfos);
        const userBrowser = parsedUserAgent.name || null;
        const userBrowserVersion = parsedUserAgent.version || null;
        const userOs = parsedUserAgent.os || null;
        db.query(`INSERT INTO statistics (urlId, userIp, userCountry, userBrowser, userBrowserVersion, userOs) VALUES (?, ?, ?, ?, ?, ?)`, [urlInfos.id, userIp, userCountry, userBrowser, userBrowserVersion, userOs], (err, rows) => {});
    });
});



router.post('/:url', (req, res) => {
    const url = `${process.env.BACKEND_API_URL}/${req.params.url}`;
    const logData = buildLogDataUrl(req, '/postUrl');
    const { password } = req.body;
    db.query(`SELECT id, redirectUrl, password, expirationDate FROM url WHERE url = (?)`, [url], (err, rows) => {
        if (err) {
            urlLogger.error(`Error selecting URL`, logData);
            return res.status(500).send('An error occurred, please try again later');
        }
        if (!rows || rows.length !== 1) {
            urlLogger.warn(`URL doesn't exists`, logData);
            return res.status(404).send('No redirection found for this URL');
        }
        const urlInfos = rows[0];
        const expirationDate = urlInfos.expirationDate ? new Date(urlInfos.expirationDate) : null;
        if (expirationDate && expirationDate < new Date()) {
            urlLogger.warn(`URL has expired`, logData);
            return res.status(410).send('This URL has expired');
        }
        if (!urlInfos.password || !password) {
            urlLogger.warn(`User didn't provide a password`, logData);
            return res.status(400).send('Please enter a valid password');
        }
        bcrypt.compare(password, urlInfos.password, (err, bres) => {
            if (err) {
                urlLogger.error(`Error during password comparaison`, logData);
                return res.status(500).json({ status: false });
            }
            if (!bres) {
                urlLogger.error(`User password is incorrect`, logData);
                return res.status(400).json({ status: false });
            }
            urlLogger.info(`User is redirected`, logData);
            res.status(302).json({ status: true, url: urlInfos.redirectUrl });
            const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const userCountry = geoip.lookup(userIp)?.country || null;
            const userAgentInfos = req.get('User-Agent');
            const parsedUserAgent = userAgent.parse(userAgentInfos);
            const userBrowser = parsedUserAgent.name || null;
            const userBrowserVersion = parsedUserAgent.version || null;
            const userOs = parsedUserAgent.os || null;
            db.query(`INSERT INTO statistics (urlId, userIp, userCountry, userBrowser, userBrowserVersion, userOs) VALUES (?, ?, ?, ?, ?, ?)`, [urlInfos.id, userIp, userCountry, userBrowser, userBrowserVersion, userOs], (err, rows) => {});
        });
    });
});



module.exports = router;