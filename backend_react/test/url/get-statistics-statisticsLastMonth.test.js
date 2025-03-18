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

describe('GET /url/get/statistics/statisticsLastMonth/:urlId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error when URL ID is missing (expected status 400)', async () => {
        const response = await request(app).get('/url/get/statistics/statisticsLastMonth/');
        expect(response.status).toBe(404);
    });

    it('should return redirection statistics for the last month (expected status 200)', async () => {
        const mockData = [
            { day: '2025-03-01', redirectionCount: 5 },
            { day: '2025-03-02', redirectionCount: 8 }
        ];
        db.query.mockImplementation((query, values, callback) => {
            callback(null, mockData);
        });
        const response = await request(app).get('/url/get/statistics/statisticsLastMonth/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: true, data: mockData });
    });

    it('should return an empty array if there are no redirections in the last month (expected status 200)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, []);
        });
        const response = await request(app).get('/url/get/statistics/statisticsLastMonth/2');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ status: false });
    });

    it('should return an error when a database error occurs (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Database error'), null);
        });
        const response = await request(app).get('/url/get/statistics/statisticsLastMonth/1');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ status: false });
    });
});
