const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,64}$/;

const urlPattern = /^https?:\/\/[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})?(:[0-9]+)?(\/.*)?$/;

const personalizedUrlPattern = /^[a-zA-Z0-9\-_]{4,150}$/;

const nameUrlPattern = /^[a-zA-Z0-9\-_!?@#$%^&*()_+{}:;, ]{1,150}$/;

const urlChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const urlCharLength = urlChar.length;

module.exports = { emailPattern, passwordPattern, urlPattern, personalizedUrlPattern, nameUrlPattern, urlChar, urlCharLength }