const request = require('supertest');
const express = require('express');
const urlRouter = require('../../routes/url');
const db = require('../../config/db');
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

describe('PUT /url/update/:urlId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error when URL ID is missing (expected status 404)', async () => {
        const response = await request(app).put('/url/update/').send({ redirectUrl: 'https://example.com' });
        expect(response.status).toBe(404);
    });

    it('should return an error when no data is provided for update (expected status 400)', async () => {
        const response = await request(app).put('/url/update/1').send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ status: false, message: 'No data provided to update' });
    });

    it('should return an error when redirectUrl is invalid (expected status 400)', async () => {
        const response = await request(app).put('/url/update/1').send({ redirectUrl: 'invalid-url' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ status: false, message: 'Please provide a valid redirect URL' });
    });

    it('should update the URL successfully (expected status 201)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });
        const response = await request(app).put('/url/update/1').send({ redirectUrl: 'https://example.com' });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ status: true, message: 'URL updated, redirection...' });
    });

    it('should return an error when database update fails (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Database error'), null);
        });
        const response = await request(app).put('/url/update/1').send({ redirectUrl: 'https://example.com' });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ status: false, message: 'An error occurred, please try again later' });
    });
});
