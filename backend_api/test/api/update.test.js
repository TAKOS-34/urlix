const request = require('supertest');
const express = require('express');
const apiRouter = require('../../routes/api');
const db = require('../../config/db');
const bcrypt = require('bcrypt');
const { apiLogger } = require('../../config/winston');
const { urlPattern, nameUrlPattern, personalizedUrlPattern } = require('../../../backend_react/utils/patterns');

const app = express();
app.use(express.json());
app.use('/api', apiRouter);

jest.mock('../../config/db', () => ({
    query: jest.fn(),
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
    hashSync: jest.fn(),
}));

jest.mock('../../../backend_react/utils/patterns', () => ({
    urlPattern: { test: jest.fn((url) => url === 'https://example.com') },
    nameUrlPattern: { test: jest.fn((name) => name === 'exampleName') },
    personalizedUrlPattern: { test: jest.fn((personalized) => personalized === 'examplePersonalized') },
}));

describe('PUT /update/:urlId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update URL details successfully (expected status 201)', async () => {
        const mockHashedPassword = 'hashedPassword';
        bcrypt.hashSync.mockReturnValue(mockHashedPassword);

        db.query.mockImplementation((query, values, callback) => {
            if (query.includes('UPDATE url')) {
                callback(null, { affectedRows: 1 });
            } else if (query.includes('UPDATE api_keys')) {
                callback(null, {});
            }
        });

        urlPattern.test.mockReturnValue(true);
        nameUrlPattern.test.mockReturnValue(true);
        personalizedUrlPattern.test.mockReturnValue(true);

        const response = await request(app).put('/api/update/1').send({
            redirectUrl: 'https://example.com',
            personalizedUrl: 'examplePersonalized',
            urlName: 'exampleName',
            expirationDate: '2050-01-01',
            password: 'StrongPassword1!',
        });

        expect(response.status).toBe(201);
        expect(db.query).toHaveBeenCalledTimes(2);
        expect(apiLogger.info).toHaveBeenCalledWith('User URL updated successfully', expect.any(Object));
    });

    it('should return 400 when redirect URL is invalid (expected status 400)', async () => {
        urlPattern.test.mockReturnValue(false);

        const response = await request(app).put('/api/update/1').send({
            redirectUrl: 'invalidUrl',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please provide a valid redirect URL');
        expect(apiLogger.warn).toHaveBeenCalledWith('User didn\'t provide a valid redirect URL', expect.any(Object));
    });

    it('should return 400 when URL name is invalid (expected status 400)', async () => {
        nameUrlPattern.test.mockReturnValue(false);

        const response = await request(app).put('/api/update/1').send({
            urlName: 'invalidName',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please provide a valid URL name');
        expect(apiLogger.warn).toHaveBeenCalledWith('User didn\'t provide a valid URL name', expect.any(Object));
    });

    it('should return 400 when personalized URL is invalid (expected status 400)', async () => {
        personalizedUrlPattern.test.mockReturnValue(false);

        const response = await request(app).put('/api/update/1').send({
            personalizedUrl: 'invalidPersonalized',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please provide a valid personalized URL');
        expect(apiLogger.warn).toHaveBeenCalledWith('User didn\'t provide a valid personalize URL', expect.any(Object));
    });

    it('should return 400 when no data is provided to update (expected status 400)', async () => {
        const response = await request(app).put('/api/update/1').send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('No data provided to update');
        expect(apiLogger.warn).toHaveBeenCalledWith('User didn\'t provide data to update', expect.any(Object));
    });

    it('should return 500 when there is a database error (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            if (query.includes('UPDATE url')) {
                callback(new Error('Database error'), null);
            }
        });
        urlPattern.test.mockReturnValue(true);

        const response = await request(app).put('/api/update/1').send({
            redirectUrl: 'https://example.com',
        });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');
        expect(apiLogger.error).toHaveBeenCalledWith('Error updating user URL', expect.any(Object));
    });

    it('should return 400 when no changes were made (expected status 400)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            if (query.includes('UPDATE url')) {
                callback(null, { affectedRows: 0 });
            }
        });
        urlPattern.test.mockReturnValue(true);

        const response = await request(app).put('/api/update/1').send({
            redirectUrl: 'https://example.com',
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('No changes were made');
        expect(apiLogger.error).toHaveBeenCalledWith('Error updating user URL, no changes were made', expect.any(Object));
    });
});

