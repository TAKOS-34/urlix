const db = require('../config/db');

const { hashApiKey } = require('../../backend_react/utils/helpers');


const auth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(400).send('API Key missing');
    }
    const hashedApiKey = hashApiKey(apiKey);
    db.query(`SELECT u.id, u.email FROM api_keys a JOIN users u ON a.userId = u.id WHERE apiKey = (?)`, [hashedApiKey], (err, rows) => {
        if (err) {
            return res.status(500).send('Internal server error');
        }
        if (!rows || rows.length !== 1) {
            return res.status(401).send('Invalid API Key');
        }
        req.user = { userId: rows[0].id, userEmail: rows[0].email, apiKey: hashedApiKey};
        return next();
    });
}


module.exports = auth;