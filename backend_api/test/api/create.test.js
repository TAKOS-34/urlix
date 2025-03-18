const request = require('supertest');
const express = require('express');
const apiRouter = require('../../routes/api');
const db = require('../../config/db');
const bcrypt = require('bcrypt');
const { generateUrl } = require('../../../backend_react/utils/helpers');
const { urlPattern, nameUrlPattern, personalizedUrlPattern } = require('../../../backend_react/utils/patterns');

const app = express();
app.use(express.json());
app.use('/api', apiRouter);

jest.mock('../../config/db', () => ({
    query: jest.fn()
}));

jest.mock('../../config/winston', () => ({
    apiLogger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
    buildLogData: jest.fn((userEmail, req, route) => ({ route })),
}));

jest.mock('../../middleware/auth', () => (req, res, next) => {
    req.user = { userId: 1, userEmail: 'test@example.com', apiKey: 'testApiKey' };
    next();
});

jest.mock('bcrypt', () => ({
    hashSync: jest.fn()
}));

jest.mock('../../../backend_react/utils/helpers', () => ({
    generateUrl: jest.fn(() => 'generatedUrl'),
    generatePersonalizedUrl: jest.fn((personalizedUrl) => `personalized-${personalizedUrl}`),
}));

jest.mock('../../../backend_react/utils/patterns', () => ({
    urlPattern: { test: jest.fn((url) => url === 'https://example.com') },
    nameUrlPattern: { test: jest.fn((name) => name === 'exampleName') },
    personalizedUrlPattern: { test: jest.fn((personalized) => personalized === 'examplePersonalized') },
}));

describe('POST /create', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new URL successfully (expected status 201)', async () => {
        const mockUrl = 'generatedUrl';
        const mockRedirectUrl = 'https://example.com';
        const mockPassword = 'StrongPassword1!';
        const mockHashedPassword = 'hashedPassword';

        bcrypt.hashSync.mockReturnValue(mockHashedPassword);
        generateUrl.mockReturnValue(mockUrl);
        urlPattern.test.mockReturnValue(true);

        db.query.mockImplementation((query, values, callback) => {
            if (query.includes('INSERT INTO url')) {
                callback(null, { affectedRows: 1 });
            } else if (query.includes('UPDATE api_keys')) {
                callback(null, {});
            }
        });

        const response = await request(app).post('/api/create').send({
            redirectUrl: mockRedirectUrl,
            password: mockPassword,
        });

        expect(response.status).toBe(201);
        expect(response.body.data.url).toBe(mockUrl);
        expect(db.query).toHaveBeenCalledTimes(2);
    });

    it('should return 400 when redirect URL is invalid (expected status 400)', async () => {
        urlPattern.test.mockReturnValue(false);

        const response = await request(app).post('/api/create').send({
            redirectUrl: 'invalidUrl',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please provide a valid redirect URL');
    });

    it('should return 400 when URL name is invalid (expected status 400)', async () => {
        urlPattern.test.mockReturnValue(true);
        nameUrlPattern.test.mockReturnValue(false);

        const response = await request(app).post('/api/create').send({
            redirectUrl: 'https://example.com',
            urlName: 'invalidName',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please provide a valid URL name');
    });

    it('should return 400 when personalized URL is invalid (expected status 400)', async () => {
        urlPattern.test.mockReturnValue(true);
        personalizedUrlPattern.test.mockReturnValue(false);

        const response = await request(app).post('/api/create').send({
            redirectUrl: 'https://example.com',
            personalizedUrl: 'invalidPersonalized',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please provide a valid personalized URL');
    });

    it('should return 500 when there is a database error (expected status 500)', async () => {
        urlPattern.test.mockReturnValue(true);

        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Database error'), null);
        });

        const response = await request(app).post('/api/create').send({
            redirectUrl: 'https://example.com',
        });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');
    });
});
