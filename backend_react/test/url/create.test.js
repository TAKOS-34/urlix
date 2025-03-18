const request = require('supertest');
const express = require('express');
const urlRouter = require('../../routes/url');
const bcrypt = require('bcrypt');
const db = require('../../config/db');
const { generatePersonalizedUrl, generateUrl } = require('../../utils/helpers');
const app = express();
app.use(express.json());
app.use('/url', urlRouter);

jest.mock('../../middleware/jwtAuth', () => (req, res, next) => {
    req.user = { userId: 1, userEmail: 'test@example.com' };
    next();
});

jest.mock('../../config/db', () => ({
    query: jest.fn()
}));

jest.mock('../../config/winston', () => ({
    urlLogger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
    buildLogData: jest.fn((email, req, route) => ({ email, route }))
}));

jest.mock('../../utils/helpers', () => ({
    generatePersonalizedUrl: jest.fn(),
    generateUrl: jest.fn()
}));

describe('POST /url/create', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new URL with personalized URL (expected status 201)', async () => {
        generatePersonalizedUrl.mockReturnValue('custom_generated');
        db.query.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });
        jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');
        const response = await request(app).post('/url/create').send({
            redirectUrl: 'https://example.com',
            personalizedUrl: 'custom',
            urlName: 'myUrl',
            expirationDate: '2025-03-17',
            password: 'secret'
        });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            status: true,
            message: 'New URL created, redirection...'
        });
    });

    it('should return an error when redirectUrl is missing or invalid (expected status 400)', async () => {
        const response = await request(app).post('/url/create').send({
            redirectUrl: '',
            personalizedUrl: 'custom',
            urlName: 'myUrl',
            expirationDate: '2025-03-17',
            password: 'secret'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Invalid or missing redirect URL'
        });
    });

    it('should return an error when urlName is invalid (expected status 400)', async () => {
        const response = await request(app).post('/url/create').send({
            redirectUrl: 'https://example.com',
            urlName: '€invalidname£'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Please provide a valid URL name'
        });
    });

    it('should return an error when personalizedUrl is invalid (expected status 400)', async () => {
        const response = await request(app).post('/url/create').send({
            redirectUrl: 'https://example.com',
            personalizedUrl: 'invalid url!'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Please provide a valid personalized URL'
        });
    });

    it('should return an error when duplicate URL error occurs (expected status 400)', async () => {
        generateUrl.mockReturnValue('generated_url');
        db.query.mockImplementation((query, values, callback) => {
            callback({ code: 'ER_DUP_ENTRY' }, null);
        });
        const response = await request(app).post('/url/create').send({
            redirectUrl: 'https://example.com'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'This URL already exists'
        });
    });

    it('should return an error when a generic DB error occurs (expected status 500)', async () => {
        generateUrl.mockReturnValue('generated_url');
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Insertion error'), null);
        });
        const response = await request(app).post('/url/create').send({
            redirectUrl: 'https://example.com'
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'An error occurred, please try again later'
        });
    });
});
