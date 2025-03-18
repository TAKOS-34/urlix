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

describe('GET /url/get/verify/:urlId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error when URL ID is missing (expected status 400)', async () => {
        const response = await request(app).get('/url/get/verify/');
        expect(response.status).toBe(404);
    });

    it('should return the user URL when it exists (expected status 200)', async () => {
        const mockUrl = {
            id: 1,
            url: 'urlix.me/abc123',
            redirectUrl: 'https://example.com',
            urlName: 'Example',
            expirationDate: '2025-12-31',
            creationDate: '2025-03-17'
        };
        db.query.mockImplementation((query, values, callback) => {
            callback(null, [mockUrl]);
        });
        const response = await request(app).get('/url/get/verify/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: true, data: mockUrl });
    });

    it('should return an error when the URL does not exist (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, []);
        });
        const response = await request(app).get('/url/get/verify/999');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ status: false });
    });

    it('should return an error when a database error occurs (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Database error'), null);
        });
        const response = await request(app).get('/url/get/verify/1');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ status: false });
    });
});
