const express = require('express');
const jwt = require('jsonwebtoken');

const jwtAuth = require('../middleware/jwtAuth');

const router = express.Router();



router.post('/verify', (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.json({ status: false });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            res.clearCookie('auth_token');
            return res.status(401).json({ status: false });
        }
        return res.json({ status: true });
    });
});



router.post('/logout', (req, res) => {
    res.clearCookie('auth_token');
    return res.json({ status: true });
});



module.exports = router;