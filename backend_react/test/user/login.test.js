const request = require('supertest');
const express = require('express');
const userRouter = require('../../routes/user');
const bcrypt = require('bcrypt');
const db = require('../../config/db');
const { generateUserToken } = require('../../utils/helpers');
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
    generateUserToken: jest.fn()
}));

describe('POST /users/login', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should log in a user successfully (expected status 200)', async () => {
        const hashedPassword = await bcrypt.hash('StrongPassword1!', 10);
        db.query
            .mockImplementationOnce((query, values, callback) => {
                callback(null, [{ id: 1, email: 'existinguser@example.com', password: hashedPassword, isConfirmed: true }]);
            })
            .mockImplementationOnce((query, values, callback) => {
                callback(null, { affectedRows: 1 });
            });
        generateUserToken.mockReturnValue('authToken');
        jest.spyOn(bcrypt, 'compare').mockImplementation((password, hash, callback) => {
            callback(null, true);
        });
        const response = await request(app).post('/users/login').send({
            email: 'existinguser@example.com',
            password: 'StrongPassword1!'
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'You\'re logged in, redirection...'
        });
        expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return an error when email or password is missing (expected status 400)', async () => {
        const response = await request(app).post('/users/login').send({
            email: '',
            password: 'StrongPassword1!'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Please fill all the fields correctly'
        });
    });

    it('should return an error when email or password pattern is invalid (expected status 400)', async () => {
        const response = await request(app).post('/users/login').send({
            email: 'invalid-email',
            password: 'weakpassword'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Respect email and password patterns'
        });
    });

    it('should return an error when email is incorrect (expected status 400)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, []);
        });
        const response = await request(app).post('/users/login').send({
            email: 'nonexistent@example.com',
            password: 'StrongPassword1!'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Wrong email or password'
        });
    });

    it('should return an error when password is incorrect (expected status 400)', async () => {
        const hashedPassword = await bcrypt.hash('StrongPassword1!', 10);
        db.query.mockImplementation((query, values, callback) => {
            callback(null, [{ id: 1, email: 'existinguser@example.com', password: hashedPassword, isConfirmed: true }]);
        });
        jest.spyOn(bcrypt, 'compare').mockImplementation((password, hash, callback) => {
            callback(null, false);
        });
        const response = await request(app).post('/users/login').send({
            email: 'existinguser@example.com',
            password: 'WrongPassword1!'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Wrong email or password'
        });
    });

    it('should return an error when user is not confirmed (expected status 403)', async () => {
        const hashedPassword = await bcrypt.hash('StrongPassword1!', 10);
        db.query.mockImplementation((query, values, callback) => {
            callback(null, [{ id: 1, email: 'existinguser@example.com', password: hashedPassword, isConfirmed: false }]);
        });
        jest.spyOn(bcrypt, 'compare').mockImplementation((password, hash, callback) => {
            callback(null, true);
        });
        const response = await request(app).post('/users/login').send({
            email: 'existinguser@example.com',
            password: 'StrongPassword1!'
        });
        expect(response.status).toBe(403);
        expect(response.body).toEqual({
            status: false,
            message: 'You need to verify your email to connect'
        });
    });

    it('should return an error when a DB error occurs (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Selection error'), null);
        });
        const response = await request(app).post('/users/login').send({
            email: 'existinguser@example.com',
            password: 'StrongPassword1!'
        });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: false,
            message: 'An error occurred, please try again later'
        });
    });
});
