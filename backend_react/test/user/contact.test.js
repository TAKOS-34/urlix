const request = require('supertest');
const express = require('express');
const userRouter = require('../../routes/user');
const { sendContactEmail } = require('../../utils/helpers');
const app = express();
app.use(express.json());
app.use('/users', userRouter);

jest.mock('../../config/winston', () => ({
    userLogger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
    buildLogData: jest.fn((email, req, route) => ({ email, route }))
}));

jest.mock('../../utils/helpers', () => ({
    sendContactEmail: jest.fn()
}));

describe('POST /users/contact', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should send contact message successfully (expected status 200)', async () => {
        const response = await request(app).post('/users/contact').send({
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'This is a test message.'
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            message: 'Message sent'
        });
        expect(sendContactEmail).toHaveBeenCalledWith('test@example.com', 'Test Subject', 'This is a test message.');
    });

    it('should return an error when required fields are missing (expected status 400)', async () => {
        const response = await request(app).post('/users/contact').send({
            email: '',
            subject: 'Test Subject',
            message: 'This is a test message.'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Please fill all the fields correctly'
        });
    });

    it('should return an error when email pattern is invalid (expected status 400)', async () => {
        const response = await request(app).post('/users/contact').send({
            email: 'invalid-email',
            subject: 'Test Subject',
            message: 'This is a test message.'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Respect email pattern'
        });
    });

    it('should return an error when subject or message length is invalid (expected status 400)', async () => {
        const response = await request(app).post('/users/contact').send({
            email: 'test@example.com',
            subject: 'Inv',
            message: 'Short'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'Respect subject or message pattern'
        });
    });
});
