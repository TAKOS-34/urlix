const request = require('supertest');
const express = require('express');
const userRouter = require('../../routes/user');
const bcrypt = require('bcrypt');
const db = require('../../config/db');
const { sendAutomaticResetPasswordEmail } = require('../../utils/helpers');
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

jest.mock('../../utils/helpers', () => ({
    sendAutomaticResetPasswordEmail: jest.fn()
}));

describe('POST /users/resetPasswordConfirm', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should reset user password (expected status 200)', async () => {
        db.query
            .mockImplementationOnce((query, values, callback) => {
                callback(null, [{ id: 1, email: 'existinguser@example.com' }]);
            })
            .mockImplementationOnce((query, values, callback) => {
                callback(null, { affectedRows: 1 });
            });
        jest.spyOn(bcrypt, 'hash').mockImplementation((password, saltRounds, callback) => {
            callback(null, 'hashedPassword');
        });
        const response = await request(app).post('/users/resetPasswordConfirm').send({
            token: 'validToken',
            password: 'StrongPassword1!',
            passwordConfirm: 'StrongPassword1!'
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'Password changed, redirecting to login...'
        });
        expect(sendAutomaticResetPasswordEmail).toHaveBeenCalledWith('existinguser@example.com');
    });

    it('should return an error when required fields are missing (expected status 400)', async () => {
        const response = await request(app).post('/users/resetPasswordConfirm').send({
            token: '',
            password: 'StrongPassword1!',
            passwordConfirm: 'StrongPassword1!'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Please fill all the fields correctly'
        });
    });

    it('should return an error when password format is invalid (expected status 400)', async () => {
        const response = await request(app).post('/users/resetPasswordConfirm').send({
            token: 'validToken',
            password: 'weakpassword',
            passwordConfirm: 'weakpassword'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Invalid password pattern'
        });
    });

    it('should return an error when passwords do not match (expected status 400)', async () => {
        const response = await request(app).post('/users/resetPasswordConfirm').send({
            token: 'validToken',
            password: 'StrongPassword1!',
            passwordConfirm: 'DifferentPassword1!'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Passwords must be the same'
        });
    });

    it('should return an error when token is invalid or expired (expected status 400)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, []);
        });
        const response = await request(app).post('/users/resetPasswordConfirm').send({
            token: 'invalidToken',
            password: 'StrongPassword1!',
            passwordConfirm: 'StrongPassword1!'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Invalid token'
        });
    });

    it('should return an error when a DB error occurs during selection (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Selection error'), null);
        });
        const response = await request(app).post('/users/resetPasswordConfirm').send({
            token: 'validToken',
            password: 'StrongPassword1!',
            passwordConfirm: 'StrongPassword1!'
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
                callback(null, [{ id: 1, email: 'existinguser@example.com' }]);
            })
            .mockImplementationOnce((query, values, callback) => {
                callback(new Error('Update error'), null);
            });
        jest.spyOn(bcrypt, 'hash').mockImplementation((password, saltRounds, callback) => {
            callback(null, 'hashedPassword');
        });
        const response = await request(app).post('/users/resetPasswordConfirm').send({
            token: 'validToken',
            password: 'StrongPassword1!',
            passwordConfirm: 'StrongPassword1!'
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'An error occurred, please try again later'
        });
    });
});
