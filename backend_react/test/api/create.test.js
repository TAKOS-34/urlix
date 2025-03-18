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

jest.mock('../../utils/helpers', () => ({
    generateApiKey: jest.fn(),
    hashApiKey: jest.fn(),
    sendApiKeyEmail: jest.fn()
}));

const db = require('../../config/db');
const { generateApiKey, hashApiKey, sendApiKeyEmail } = require('../../utils/helpers');

const app = express();
app.use(express.json());
app.use('/api', apiRouter);

describe('POST /api/create', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create an API key and send email when DB insertion is successful (expected status 201)', async () => {
        const fakeApiKey = 'abcdefghij1234567890';
        const fakeHashedApiKey = 'hashed_abcdefghij1234567890';

        generateApiKey.mockReturnValue(fakeApiKey);
        hashApiKey.mockReturnValue(fakeHashedApiKey);

        db.query.mockImplementation((query, params, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app).post('/api/create');

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            status: true,
            message: 'API key created and sent to your email'
        });
        expect(sendApiKeyEmail).toHaveBeenCalledWith('test@example.com', fakeApiKey);
    });

    it('should return a 400 error when DB insertion fails (expected status 400)', async () => {
        const fakeApiKey = 'abcdefghij1234567890';

        generateApiKey.mockReturnValue(fakeApiKey);
        hashApiKey.mockReturnValue('hashed_abcdefghij1234567890');

        db.query.mockImplementation((query, params, callback) => {
            callback(new Error('Insertion error'), null);
        });

        const response = await request(app).post('/api/create');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'An error has occurred, please try again later'
        });
    });

    it('should return a 400 error when DB insertion does not affect one row (expected status 400)', async () => {
        const fakeApiKey = 'abcdefghij1234567890';

        generateApiKey.mockReturnValue(fakeApiKey);
        hashApiKey.mockReturnValue('hashed_abcdefghij1234567890');

        db.query.mockImplementation((query, params, callback) => {
            callback(null, { affectedRows: 0 });
        });

        const response = await request(app).post('/api/create');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: false,
            message: 'An error has occurred, please try again later'
        });
    });
});