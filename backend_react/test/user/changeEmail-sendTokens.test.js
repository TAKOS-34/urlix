const request = require('supertest');
const express = require('express');
const userRouter = require('../../routes/user');
const db = require('../../config/db');
const { sendAutomaticChangeEmailEmail } = require('../../utils/helpers');
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

jest.mock('../../utils/helpers', () => ({
    sendAutomaticChangeEmailEmail: jest.fn()
}));

describe('POST /users/changeEmail/sendTokens', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update user email successfully (expected status 200)', async () => {
        db.query
            .mockImplementationOnce((query, values, callback) => {
                callback(null, [{
                    email: 'test@example.com',
                    AET: 'actualEmailToken',
                    NET: 'newEmailToken',
                    newEmailRequest: 'newemail@example.com'
                }]);
            })
            .mockImplementationOnce((query, values, callback) => {
                callback(null, { affectedRows: 1 });
            });
        const response = await request(app).post('/users/changeEmail/sendTokens').send({
            actualEmailToken: 'actualEmailToken',
            newEmailToken: 'newEmailToken'
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'Email changed, redirecting to login...'
        });
        expect(sendAutomaticChangeEmailEmail).toHaveBeenCalledWith('test@example.com');
        const cookieHeader = response.headers['set-cookie'][0];
        expect(cookieHeader).toContain('auth_token=;');

    });

    it('should return an error when tokens are missing (expected status 400)', async () => {
        const response = await request(app).post('/users/changeEmail/sendTokens').send({
            actualEmailToken: '',
            newEmailToken: 'newEmailToken'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Please fill all the fields correctly'
        });
    });

    it('should return an error when tokens are invalid (expected status 401)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, [{
                email: 'test@example.com',
                AET: 'actualEmailToken',
                NET: 'newEmailToken',
                newEmailRequest: 'newemail@example.com'
            }]);
        });
        const response = await request(app).post('/users/changeEmail/sendTokens').send({
            actualEmailToken: 'invalidToken',
            newEmailToken: 'newEmailToken'
        });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            status: false,
            message: 'Invalid tokens'
        });
    });

    it('should return an error when a DB error occurs during selection (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Selection error'), null);
        });
        const response = await request(app).post('/users/changeEmail/sendTokens').send({
            actualEmailToken: 'actualEmailToken',
            newEmailToken: 'newEmailToken'
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
                callback(null, [{
                    email: 'test@example.com',
                    AET: 'actualEmailToken',
                    NET: 'newEmailToken',
                    newEmailRequest: 'newemail@example.com'
                }]);
            })
            .mockImplementationOnce((query, values, callback) => {
                callback(new Error('Update error'), null);
            });
        const response = await request(app).post('/users/changeEmail/sendTokens').send({
            actualEmailToken: 'actualEmailToken',
            newEmailToken: 'newEmailToken'
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'An error occurred, please try again later'
        });
    });
});
