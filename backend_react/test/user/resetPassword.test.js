const request = require('supertest');
const express = require('express');
const userRouter = require('../../routes/user');
const db = require('../../config/db');
const { generateUserConfirmationToken, sendResetPasswordEmail } = require('../../utils/helpers');
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
    buildLogData: jest.fn((email, req, route) => ({ email, route }))
}));

jest.mock('../../utils/helpers', () => ({
    generateUserConfirmationToken: jest.fn(),
    sendResetPasswordEmail: jest.fn()
}));

describe('POST /users/resetPassword', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should send password reset email (expected status 200)', async () => {
        generateUserConfirmationToken.mockReturnValue('resetToken');
        db.query.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });
        const response = await request(app).post('/users/resetPassword').send({
            email: 'existinguser@example.com'
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'A password reset email has been sent'
        });
        expect(sendResetPasswordEmail).toHaveBeenCalledWith('existinguser@example.com', 'resetToken');
    });

    it('should return an error when email is missing (expected status 400)', async () => {
        const response = await request(app).post('/users/resetPassword').send({
            email: ''
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Please fill all the fields correctly'
        });
    });

    it('should return an error when email format is invalid (expected status 400)', async () => {
        const response = await request(app).post('/users/resetPassword').send({
            email: 'invalid-email'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Respect email pattern'
        });
    });

    it('should return an error when a DB error occurs (expected status 500)', async () => {
        generateUserConfirmationToken.mockReturnValue('resetToken');
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Update error'), null);
        });
        const response = await request(app).post('/users/resetPassword').send({
            email: 'existinguser@example.com'
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'An error occurred, please try again later'
        });
    });
});
