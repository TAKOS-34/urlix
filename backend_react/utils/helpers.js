require('dotenv').config();

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const handlebars = require('handlebars');
const transporter = require('../config/mail');

const { urlChar, urlCharLength } = require('./patterns');



const generateUserConfirmationToken = () => {
    let confirmationToken = '';
    for (let i = 0; i < 255; i++) {
        confirmationToken += urlChar[Math.floor(Math.random() * urlCharLength)];
    }
    return confirmationToken;
}



const generateUserToken = (id, email) => {
    return jwt.sign({ userId: id, userEmail: email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}



const generateUrl = () => {
    let url = '';
    const randomLength = Math.floor(Math.random() * 5) + 4;
    for (let i = 0; i < randomLength; i++) {
        url += urlChar[Math.floor(Math.random() * urlCharLength)];
    }
    return `${process.env.BACKEND_API_URL}/${url}`;
}



const generatePersonalizedUrl = (url) => {
    return `${process.env.BACKEND_API_URL}/${url}`;
}



const generateApiKey = () => {
    let apiKey = '';
    for (let i = 0; i < 64; i++) {
        apiKey += urlChar[Math.floor(Math.random() * urlCharLength)];
    }
    return apiKey;
}



const hashApiKey = (apiKey) => {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
}



const sendConfirmationEmail = (email, token) => {
    const templateSource = fs.readFileSync("./views/confirmAccountEmail.hbs", "utf8");
    const template = handlebars.compile(templateSource);
    const emailHtml = template({ frontendUrl: process.env.FRONTEND_URL, token });
    transporter.sendMail({
        from: `"URLIX" <${process.env.MAIL_USER}>`,
        to: email,
        subject: `URLIX | Confirm your email`,
        html: emailHtml
    }, (err, info) => { return; });
}



const sendResetPasswordEmail = (email, token) => {
    const templateSource = fs.readFileSync("./views/resetPasswordEmail.hbs", "utf8");
    const template = handlebars.compile(templateSource);
    const emailHtml = template({ frontendUrl: process.env.FRONTEND_URL, token });
    transporter.sendMail({
        from: `"URLIX" <${process.env.MAIL_USER}>`,
        to: email,
        subject: `URLIX | Reset your password`,
        html: emailHtml
    }, (err, info) => { return; });
}



const sendChangeEmailToken = (email, token) => {
    const templateSource = fs.readFileSync("./views/changeEmailEmail.hbs", "utf8");
    const template = handlebars.compile(templateSource);
    const emailHtml = template({ frontendUrl: process.env.FRONTEND_URL, token });
    transporter.sendMail({
        from: `"URLIX" <${process.env.MAIL_USER}>`,
        to: email,
        subject: `URLIX | Change email token`,
        html: emailHtml
    }, (err, info) => { return; });
}



const sendApiKeyEmail = (email, apiKey) => {
    const templateSource = fs.readFileSync("./views/apiKeyEmail.hbs", "utf8");
    const template = handlebars.compile(templateSource);
    const emailHtml = template({ frontendUrl: process.env.FRONTEND_URL, apiKey });
    transporter.sendMail({
        from: `"URLIX" <${process.env.MAIL_USER}>`,
        to: email,
        subject: `URLIX | Your API Key`,
        html: emailHtml
    }, (err, info) => { return; });
}


const sendAutomaticResetPasswordEmail = (email) => {
    const templateSource = fs.readFileSync("./views/automaticResetPasswordEmail.hbs", "utf8");
    const template = handlebars.compile(templateSource);
    const emailHtml = template({ frontendUrl: process.env.FRONTEND_URL, email });
    transporter.sendMail({
        from: `"URLIX" <${process.env.MAIL_USER}>`,
        to: email,
        subject: `URLIX | Your Password Has Been Successfully Changed`,
        html: emailHtml
    }, (err, info) => { return; });
}



const sendAutomaticChangeEmailEmail = (email) => {
    const templateSource = fs.readFileSync("./views/automaticChangeEmailEmail.hbs", "utf8");
    const template = handlebars.compile(templateSource);
    const emailHtml = template({ frontendUrl: process.env.FRONTEND_URL, email });
    transporter.sendMail({
        from: `"URLIX" <${process.env.MAIL_USER}>`,
        to: email,
        subject: `URLIX | Your Email Address Has Been Updated`,
        html: emailHtml
    }, (err, info) => { return; });
}



const sendContactEmail = (email, subject, message) => {
    const templateSource = fs.readFileSync("./views/userContactEmail.hbs", "utf8");
    const template = handlebars.compile(templateSource);
    const emailHtml = template({ email, subject, message });
    transporter.sendMail({
        from: email,
        to: process.env.MAIL_USER,
        subject: `URLIX | New contact message`,
        html: emailHtml
    }, (err, info) => { return; });
}



module.exports = { generateUserConfirmationToken, generateUserToken, generateUrl, generatePersonalizedUrl, generateApiKey, hashApiKey, sendConfirmationEmail, sendResetPasswordEmail, sendChangeEmailToken, sendApiKeyEmail, sendContactEmail, sendAutomaticResetPasswordEmail, sendAutomaticChangeEmailEmail };