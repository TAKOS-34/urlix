const request = require('supertest');
const express = require('express');
const userRouter = require('../../routes/user');
const db = require('../../config/db');
const app = express();
app.use(express.json());
app.use('/users', userRouter);

jest.mock('../../middleware/jwtAuth', () => (req, res, next) => {
    req.user = { userId: 1, userEmail: 'test@example.com' };
    next();
});

jest.mock('../../config/db', () => ({
    query: jest.fn()
}));

jest.mock('../../config/winston', () => ({
    userLogger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
    buildLogData: jest.fn((userEmail, req, route) => ({ userEmail, route }))
}));

describe('GET /users/getInfos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return user info successfully (expected status 200)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, [{
                email: 'test@example.com',
                creationDate: '2023-01-01',
                totalUrls: 5,
                totalRedirections: 10
            }]);
        });
        const response = await request(app).get('/users/getInfos');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            data: {
                email: 'test@example.com',
                creationDate: '2023-01-01',
                totalUrls: 5,
                totalRedirections: 10
            }
        });
    });

    it('should return an error when a DB error occurs (expected status 401)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Selection error'), null);
        });
        const response = await request(app).get('/users/getInfos');
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            status: false
        });
    });

    it('should return an error when no user info is found (expected status 401)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, []);
        });
        const response = await request(app).get('/users/getInfos');
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            status: false
        });
    });
});
