const jwt = require('jsonwebtoken');



const jwtAuth = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ status: false, message: 'An error occurred, please try again later' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || !decoded || !decoded.userId || !decoded.userEmail) {
            res.clearCookie('auth_token');
            return res.status(401).json({ status: false, message: 'Invalid token, please try again later' });
        }
        req.user = decoded;
        return next();
    });
};



module.exports = jwtAuth;