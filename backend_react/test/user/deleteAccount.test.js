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

describe('POST /users/deleteAccount', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete user account successfully (expected status 200)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });
        const response = await request(app).post('/users/deleteAccount');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'Your account has been deleted'
        });

        const cookieHeader = response.headers['set-cookie'][0];
        expect(cookieHeader).toContain('auth_token=;');
    });

    it('should return an error when a DB error occurs (expected status 400)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Delete error'), null);
        });
        const response = await request(app).post('/users/deleteAccount');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'An error occurred, please try again later'
        });
    });
});
