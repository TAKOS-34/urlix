const request = require('supertest');
const express = require('express');
const userRouter = require('../../routes/user');
const bcrypt = require('bcrypt');
const db = require('../../config/db');
const { generateUserConfirmationToken } = require('../../utils/helpers');
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
    sendConfirmationEmail: jest.fn()
}));

describe('POST /users/signUp', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new user (expected status 201)', async () => {
        generateUserConfirmationToken.mockReturnValue('confirmationToken');
        db.query.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });
        jest.spyOn(bcrypt, 'hash').mockImplementation((password, saltRounds, callback) => {
            callback(null, 'hashedPassword');
        });
        const response = await request(app).post('/users/signUp').send({
            email: 'newuser@example.com',
            password: 'StrongPassword1!',
            passwordConfirm: 'StrongPassword1!'
        });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            status: true,
            message: 'Account created. Verify your email to login'
        });
    });

    it('should return an error when required fields are missing (expected status 400)', async () => {
        const response = await request(app).post('/users/signUp').send({
            email: '',
            password: 'StrongPassword1!',
            passwordConfirm: 'StrongPassword1!'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Please fill all the fields correctly'
        });
    });

    it('should return an error when email or password patterns are not respected (expected status 400)', async () => {
        const response = await request(app).post('/users/signUp').send({
            email: 'invalid-email',
            password: 'weakpassword',
            passwordConfirm: 'weakpassword'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Respect email and password patterns'
        });
    });

    it('should return an error when passwords do not match (expected status 400)', async () => {
        const response = await request(app).post('/users/signUp').send({
            email: 'newuser@example.com',
            password: 'StrongPassword1!',
            passwordConfirm: 'DifferentPassword1!'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Passwords must be the same'
        });
    });

    it('should return an error when email is already taken (expected status 400)', async () => {
        generateUserConfirmationToken.mockReturnValue('confirmationToken');
        db.query.mockImplementation((query, values, callback) => {
            callback({ code: 'ER_DUP_ENTRY' }, null);
        });
        jest.spyOn(bcrypt, 'hash').mockImplementation((password, saltRounds, callback) => {
            callback(null, 'hashedPassword');
        });
        const response = await request(app).post('/users/signUp').send({
            email: 'existinguser@example.com',
            password: 'StrongPassword1!',
            passwordConfirm: 'StrongPassword1!'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Email already taken'
        });
    });

    it('should return an error when a generic DB error occurs (expected status 500)', async () => {
        generateUserConfirmationToken.mockReturnValue('confirmationToken');
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Insertion error'), null);
        });
        jest.spyOn(bcrypt, 'hash').mockImplementation((password, saltRounds, callback) => {
            callback(null, 'hashedPassword');
        });
        const response = await request(app).post('/users/signUp').send({
            email: 'newuser@example.com',
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
