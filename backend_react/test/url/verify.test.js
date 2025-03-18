const request = require('supertest');
const express = require('express');
const urlRouter = require('../../routes/url');
const db = require('../../config/db');
const app = express();
app.use(express.json());
app.use('/url', urlRouter);

jest.mock('../../middleware/jwtAuth', () => (req, res, next) => {
    req.user = { userEmail: 'test@example.com' };
    next();
});

jest.mock('../../config/db', () => ({
    query: jest.fn()
}));

jest.mock('../../config/winston', () => ({
    urlLogger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
    buildLogData: jest.fn((email, req, route) => ({ email, route }))
}));

describe('POST /url/verifyPersonalizedUrl', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error when personalizedUrl is missing (expected status 400)', async () => {
        const response = await request(app).post('/url/verifyPersonalizedUrl').send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ status: false });
    });

    it('should return available false when personalizedUrl is invalid (expected status 200)', async () => {
        const response = await request(app).post('/url/verifyPersonalizedUrl').send({
            personalizedUrl: 'invalid url!'
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: true, available: false });
    });

    it('should return available false when personalizedUrl already exists (expected status 200)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, [{ url: 'existingUrl' }]);
        });
        const response = await request(app).post('/url/verifyPersonalizedUrl').send({
            personalizedUrl: 'existingUrl'
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: true, available: false });
    });

    it('should return available true when personalizedUrl does not exist (expected status 200)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, []);
        });
        const response = await request(app).post('/url/verifyPersonalizedUrl').send({
            personalizedUrl: 'newUniqueUrl'
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: true, available: true });
    });

    it('should return an error when a database error occurs (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Database error'), null);
        });
        const response = await request(app).post('/url/verifyPersonalizedUrl').send({
            personalizedUrl: 'anyUrl'
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ status: false });
    });
});
