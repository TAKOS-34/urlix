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

describe('GET /url/get/statistics/totalRedirections/:urlId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error when URL ID is missing (expected status 400)', async () => {
        const response = await request(app).get('/url/get/statistics/totalRedirections/');
        expect(response.status).toBe(404);
    });

    it('should return the total redirections when the URL exists (expected status 200)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, [{ totalRedirection: 15 }]);
        });
        const response = await request(app).get('/url/get/statistics/totalRedirections/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: true, data: 15 });
    });

    it('should return 0 redirections if no statistics exist (expected status 200)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, [{ totalRedirection: 0 }]);
        });
        const response = await request(app).get('/url/get/statistics/totalRedirections/2');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: true, data: 0 });
    });

    it('should return an error when the URL does not exist (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, []);
        });
        const response = await request(app).get('/url/get/statistics/totalRedirections/999');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ status: false });
    });

    it('should return an error when a database error occurs (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Database error'), null);
        });
        const response = await request(app).get('/url/get/statistics/totalRedirections/1');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ status: false });
    });
});
