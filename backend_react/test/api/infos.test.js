const request = require('supertest');
const express = require('express');
const apiRouter = require('../../routes/api');

jest.mock('../../middleware/jwtAuth', () => (req, res, next) => {
    req.user = { userId: 1, userEmail: 'test@example.com' };
    next();
});

jest.mock('../../config/db', () => ({
    query: jest.fn()
}));

jest.mock('../../config/winston', () => ({
    apiLogger: { error: jest.fn(), info: jest.fn() },
    buildLogData: jest.fn((email, req, route) => ({ email, route }))
}));

const db = require('../../config/db');

const app = express();
app.use(express.json());
app.use('/api', apiRouter);

describe('GET /api/infos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return API key info when the DB returns one row (expected status 200)', async () => {
        const fakeRow = {
            firstChars: 'abc',
            creationDate: '2021-01-01',
            numberOfUses: 10,
            lastTimeUsed: '2021-01-02'
        };
        db.query.mockImplementation((query, params, callback) => {
            callback(null, [fakeRow]);
        });

        const response = await request(app).get('/api/infos');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: true, data: fakeRow });
    });

    it('should return status true with null data when the user has no API key (expected status 200)', async () => {
        db.query.mockImplementation((query, params, callback) => {
            callback(null, []);
        });

        const response = await request(app).get('/api/infos');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: true, data: null });
    });

    it('should return a 500 error when a DB error occurs (expected status 500)', async () => {
        db.query.mockImplementation((query, params, callback) => {
            callback(new Error("DB error"), null);
        });

        const response = await request(app).get('/api/infos');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'An error has occurred, please try again later'
        });
    });
});