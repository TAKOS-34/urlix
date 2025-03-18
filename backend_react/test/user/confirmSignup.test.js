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
    buildLogData: jest.fn((token, req, route) => ({ token, route }))
}));

describe('POST /users/confirmSignUp', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should confirm user sign up (expected status 200)', async () => {
        db.query
            .mockImplementationOnce((query, values, callback) => {
                callback(null, [{ id: 1 }]);
            })
            .mockImplementationOnce((query, values, callback) => {
                callback(null, { affectedRows: 1 });
            });
        const response = await request(app).post('/users/confirmSignUp').send({
            token: 'validToken'
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'Your account has been verified, you can now login'
        });
    });

    it('should return an error when token is missing (expected status 400)', async () => {
        const response = await request(app).post('/users/confirmSignUp').send({
            token: ''
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Token missing'
        });
    });

    it('should return an error when token is invalid or expired (expected status 400)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, []);
        });
        const response = await request(app).post('/users/confirmSignUp').send({
            token: 'invalidToken'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Invalid or expired token'
        });
    });

    it('should return an error when a DB error occurs during selection (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Selection error'), null);
        });
        const response = await request(app).post('/users/confirmSignUp').send({
            token: 'validToken'
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'An error occurred, please try again later'
        });
    });

    it('should return an error when a DB error occurs during update (expected status 500)', async () => {
        db.query
            .mockImplementationOnce((query, values, callback) => {
                callback(null, [{ id: 1 }]);
            })
            .mockImplementationOnce((query, values, callback) => {
                callback(new Error('Update error'), null);
            });
        const response = await request(app).post('/users/confirmSignUp').send({
            token: 'validToken'
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'An error occurred, please try again later'
        });
    });
});