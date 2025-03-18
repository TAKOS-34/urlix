const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

const db = require('../config/db');
const jwtAuth = require('../middleware/jwtAuth');
const { userLogger, buildLogData } = require('../config/winston');

const { emailPattern, passwordPattern } = require('../utils/patterns');
const { sendConfirmationEmail, sendResetPasswordEmail, sendChangeEmailToken, sendContactEmail, sendAutomaticResetPasswordEmail, generateUserConfirmationToken, generateUserToken, sendAutomaticChangeEmailEmail } = require('../utils/helpers');

const router = express.Router();



router.post('/signUp', (req, res) => {
    const { email, password, passwordConfirm } = req.body;
    const logData = buildLogData(email, req, '/signUp');
    if (!email || !password || !passwordConfirm) {
        userLogger.warn(`User didn't provide all required fields`, logData);
        return res.status(400).json({ status: false, message: 'Please fill all the fields correctly' });
    }
    if (!emailPattern.test(email) || !passwordPattern.test(password)) {
        userLogger.warn(`User didn't respect email and password patterns`, logData);
        return res.status(400).json({ status: false, message: 'Respect email and password patterns' });
    }
    if (password !== passwordConfirm) {
        userLogger.warn(`Passwords must be the same`, logData);
        return res.status(400).json({ status: false, message: 'Passwords must be the same' });
    }
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            userLogger.error(`Error while hashing password`, logData);
            return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
        }
        const confirmationToken = generateUserConfirmationToken();
        db.query(`INSERT INTO users (email, password, confirmationToken) VALUES (?, ?, ?)`, [email, hashedPassword, confirmationToken], (err, rows) => {
            if (err?.code === 'ER_DUP_ENTRY') {
                userLogger.warn(`Email already taken`, logData);
                return res.status(400).json({ status: false, message: 'Email already taken' });
            }
            if (err || rows?.affectedRows !== 1) {
                userLogger.error(`Error inserting user in database`, logData);
                return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
            }
            sendConfirmationEmail(email, confirmationToken);
            userLogger.info(`User created successfully`, logData);
            return res.status(201).json({ status: true, message: 'Account created. Verify your email to login' });
        });
    });
});




router.post('/confirmSignUp', (req, res) => {
    const { token } = req.body;
    const logData = buildLogData(token, req, '/confirmSignUp');
    if (!token) {
        userLogger.warn(`Token missing`, logData);
        return res.status(400).json({ status: false, message: 'Token missing' });
    }
    db.query(`SELECT id FROM users WHERE confirmationToken = (?)`, [token], (err, rows) => {
        if (err) {
            userLogger.error(`Error selecting user by confirmation token`, logData);
            return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
        }
        if (!rows || rows.length !== 1) {
            userLogger.warn(`Invalid or expired token`, logData);
            return res.status(400).json({ status: false, message: 'Invalid or expired token' });
        }
        const { id } = rows[0];
        db.query(`UPDATE users SET isConfirmed = TRUE, confirmationToken = NULL WHERE id = (?)`, [id], (err, rows) => {
            if (err || rows?.affectedRows !== 1) {
                userLogger.error(`Error updating user confirmation status`, logData);
                return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
            }
            userLogger.info(`User confirmed account successfully`, logData);
            return res.json({ status: true, message: 'Your account has been verified, you can now login' });
        });
    });
});




router.post('/resendEmail', (req, res) => {
    const { email } = req.body;
    const logData = buildLogData(email, req, '/resendEmail');
    if (!email) {
        userLogger.warn(`User didn't provide an email`, logData);
        return res.status(400).json({ status: false, message: 'Please fill all the fields correctly' });
    }
    if (!emailPattern.test(email)) {
        userLogger.warn(`User provided an invalid email format`, logData);
        return res.status(400).json({ status: false, message: 'Respect email pattern' });
    }
    const confirmationToken = generateUserConfirmationToken();
    db.query(`UPDATE users SET confirmationToken = (?) WHERE email = (?)`, [confirmationToken, email], (err, rows) => {
        if (err || rows?.affectedRows !== 1) {
            userLogger.error(`Error updating confirmation token`, logData);
            return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
        }
        sendConfirmationEmail(email, confirmationToken);
        userLogger.info(`Resent confirmation email successfully`, logData);
        return res.json({ status: true, message: 'A confirmation email has been sent again' });
    });
});




router.post('/resetPassword', (req, res) => {
    const { email } = req.body;
    const logData = buildLogData(email, req, '/resetPassword');
    if (!email) {
        userLogger.warn(`User didn't provide an email`, logData);
        return res.status(400).json({ status: false, message: 'Please fill all the fields correctly' });
    }
    if (!emailPattern.test(email)) {
        userLogger.warn(`User provided an invalid email format`, logData);
        return res.status(400).json({ status: false, message: 'Respect email pattern' });
    }
    const token = generateUserConfirmationToken();
    db.query(`UPDATE users SET resetPasswordToken = (?) WHERE email = (?)`, [token, email], (err, rows) => {
        if (err || rows?.affectedRows !== 1) {
            userLogger.error(`Error updating reset password token`, logData);
            return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
        }
        sendResetPasswordEmail(email, token);
        userLogger.info(`Sent password reset email successfully`, logData);
        return res.json({ status: true, message: 'A password reset email has been sent' });
    });
});




router.post('/resetPasswordConfirm', (req, res) => {
    const { token, password, passwordConfirm } = req.body;
    const logData = buildLogData(token, req, '/resetPasswordConfirm');
    if (!token || !password || !passwordConfirm) {
        userLogger.warn(`User didn't provide all required fields`, logData);
        return res.status(400).json({ status: false, message: 'Please fill all the fields correctly' });
    }
    if (!passwordPattern.test(password) || !passwordPattern.test(passwordConfirm)) {
        userLogger.warn(`User provided an invalid password format`, logData);
        return res.status(400).json({ status: false, message: 'Invalid password pattern' });
    }
    if (password !== passwordConfirm) {
        userLogger.warn(`User passwords do not match`, logData);
        return res.status(400).json({ status: false, message: 'Passwords must be the same' });
    }
    db.query(`SELECT id, email FROM users WHERE resetPasswordToken = (?)`, [token], (err, rows) => {
        if (err) {
            userLogger.error(`Error retrieving user by reset password token`, logData);
            return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
        }
        if (!rows || rows.length !== 1) {
            userLogger.warn(`User provided an invalid or expired token`, logData);
            return res.status(400).json({ status: false, message: 'Invalid token' });
        }
        const { id, email } = rows[0];
        const userLogData = buildLogData(email, req, '/resetPasswordConfirm');
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                userLogger.error(`Error hashing new password`, userLogData);
                return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
            }
            db.query(`UPDATE users SET password = (?), resetPasswordToken = NULL WHERE id = (?)`, [hashedPassword, id], (err, rows) => {
                if (err || rows?.affectedRows !== 1) {
                    userLogger.error(`Error updating user password`, userLogData);
                    return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
                }
                sendAutomaticResetPasswordEmail(email);
                userLogger.info(`User successfully reset their password`, userLogData);
                return res.json({ status: true, message: 'Password changed, redirecting to login...' });
            });
        });
    });
});




router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const logData = buildLogData(email, req, '/login');
    if (!email || !password) {
        userLogger.warn(`User didn't fill all the fields correctly`, logData);
        return res.status(400).json({ status: false, message: 'Please fill all the fields correctly' });
    }
    if (!emailPattern.test(email) || !passwordPattern.test(password)) {
        userLogger.warn(`User didn't follow email and password patterns`, logData);
        return res.status(400).json({ status: false, message: 'Respect email and password patterns' });
    }
    db.query(`SELECT id, email, password, isConfirmed FROM users WHERE email = (?)`, [email], (err, rows) => {
        if (err) {
            userLogger.error(`Error selecting user info from database`, logData);
            return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
        }
        if (!rows || rows.length !== 1) {
            userLogger.warn(`User submitted wrong email`, logData);
            return res.status(400).json({ status: false, message: 'Wrong email or password' });
        }
        const user = rows[0];
        bcrypt.compare(password, user.password, (err, bres) => {
            if (err) {
                userLogger.error(`Error during password comparison`, logData);
                return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
            }
            if (!bres) {
                userLogger.warn(`User submitted wrong password`, logData);
                return res.status(400).json({ status: false, message: 'Wrong email or password' });
            }
            if (!user.isConfirmed) {
                userLogger.warn(`User didn't verify his account`, logData);
                return res.status(403).json({ status: false, message: 'You need to verify your email to connect' });
            }
            const token = generateUserToken(user.id, user.email);
            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'Strict',
                maxAge: 86400000,
            });
            userLogger.info(`User logged in successfully`, logData);
            res.json({ status: true, message: 'You\'re logged in, redirection...' });
            db.query(`UPDATE users SET lastTimeLogin = NOW() WHERE id = (?)`, [user.id], (err, rows) => {});
        });
    });
});



router.get('/getInfos', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/getInfos');
    db.query(`SELECT users.email, users.creationDate, COUNT(DISTINCT u.id) AS totalUrls, COUNT(s.id) AS totalRedirections FROM users LEFT JOIN url u ON users.id = u.userId LEFT JOIN statistics s ON u.id = s.urlId WHERE users.id = (?) GROUP BY users.id`, [userId], (err, rows) => {
        if (err || !rows || rows.length !== 1) {
            userLogger.error(`Error selecting user info from database`, logData);
            return res.status(401).json({ status: false });
        }
        userLogger.info(`User gets info successfully`, logData);
        return res.json({ status: true, data: rows[0] });
    });
});



router.post('/changeEmail/sendEmailTokens', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const { newEmail } = req.body;
    const logData = buildLogData(userEmail, req, '/sendEmailTokens');
    if (!newEmail) {
        userLogger.warn(`User didn't provide a new email`, logData);
        return res.status(400).json({ status: false, message: 'Please fill all the fields correctly' });
    }
    if (!emailPattern.test(newEmail)) {
        userLogger.warn(`User didn't provide valid new email pattern`, logData);
        return res.status(400).json({ status: false, message: 'Respect email pattern' });
    }
    const actualEmailToken = generateUserConfirmationToken();
    const newEmailToken = generateUserConfirmationToken();
    db.query(`UPDATE users SET actualEmailToken = (?), newEmailToken = (?), newEmailRequest = (?) WHERE id = (?)`, [actualEmailToken, newEmailToken, newEmail, userId], (err, rows) => {
        if (err || rows?.affectedRows !== 1) {
            userLogger.error(`Error during updating emails token`, logData);
            return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
        }
        sendChangeEmailToken(userEmail, actualEmailToken);
        sendChangeEmailToken(newEmail, newEmailToken);
        userLogger.info(`Token Emails sent successfully`, logData);
        return res.json({ status: true, message: 'Email change tokens has been sent' });
    });
});



router.post('/changeEmail/sendTokens', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const { actualEmailToken, newEmailToken } = req.body;
    const logData = buildLogData(userEmail, req, '/sendTokens');
    if (!actualEmailToken || !newEmailToken) {
        userLogger.warn(`User didn't provide tokens`, logData);
        return res.status(400).json({ status: false, message: 'Please fill all the fields correctly' });
    }
    db.query(`SELECT email, actualEmailToken AS AET, newEmailToken AS NET, newEmailRequest FROM users WHERE id = (?)`, [userId], (err, rows) => {
        if (err || !rows || rows.length !== 1) {
            userLogger.error(`Error during selecting emails token`, logData);
            return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
        }
        const { email, AET, NET, newEmailRequest } = rows[0];
        if (!AET || !NET || actualEmailToken !== AET || newEmailToken !== NET) {
            userLogger.warn(`User didn't provide valid tokens`, logData);
            return res.status(401).json({ status: false, message: 'Invalid tokens' });
        }
        db.query(`UPDATE users SET email = (?), actualEmailToken = NULL, newEmailToken = NULL, newEmailRequest = NULL WHERE id = (?)`, [newEmailRequest, userId], (err, rows) => {
            if (err || rows?.affectedRows !== 1) {
                userLogger.error(`Error during updating new email for user`, logData);
                return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
            }
            sendAutomaticChangeEmailEmail(email);
            res.clearCookie('auth_token');
            userLogger.info(`User email updated successfully`, logData);
            return res.json({ status: true, message: 'Email changed, redirecting to login...' });
        });
    });
});



router.post('/changePassword', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/changePassword');
    const token = generateUserConfirmationToken();
    db.query(`UPDATE users SET resetPasswordToken = (?) WHERE id = (?)`, [token, userId], (err, rows) => {
        if (err || rows?.affectedRows !== 1) {
            userLogger.error(`Error during updating user reset password token`, logData);
            return res.status(500).json({ status: false, message: 'An error occurred, please try again later' });
        }
        sendResetPasswordEmail(userEmail, token);
        res.clearCookie('auth_token');
        userLogger.info(`User password token updated successfully`, logData);
        return res.json({ status: true, message: 'A password reset email has been sent' });
    });
});



router.post('/deleteAccount', jwtAuth, (req, res) => {
    const { userId, userEmail } = req.user;
    const logData = buildLogData(userEmail, req, '/deleteAccount');
    db.query(`DELETE FROM users WHERE id = (?)`, [userId], (err, rows) => {
        if (err || rows?.affectedRows !== 1) {
            userLogger.error(`Error during deleting user account`, logData);
            return res.status(400).json({ status: false, message: 'An error occurred, please try again later' });
        }
        res.clearCookie('auth_token');
        userLogger.info(`User account deleted successfully`, logData);
        return res.json({ status: true, message: 'Your account has been deleted' });
    });
});



router.post('/contact', (req, res) => {
    const { email, subject, message } = req.body;
    const logData = buildLogData(email, req, '/contact');
    if (!email || !subject || !message) {
        userLogger.warn(`User didn't provide all required fields`, logData);
        return res.status(400).json({ status: false, message: 'Please fill all the fields correctly' });
    }
    if (!emailPattern.test(email)) {
        userLogger.warn(`User didn't provide a valid email pattern`, logData);
        return res.status(400).json({ status: false, message: 'Respect email pattern' });
    }
    if (subject.length < 4 || subject.length > 150 || message.length < 4 || message.length > 3000) {
        userLogger.warn(`User didn't provide a valid subject or message length`, logData);
        return res.status(400).json({ status: false, message: 'Respect subject or message pattern' });
    }
    sendContactEmail(email, subject, message);
    userLogger.info(`User sent contact message successfully`, logData);
    return res.json({ status: true, message: 'Message sent' });
});



module.exports = router;