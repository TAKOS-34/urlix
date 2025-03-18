const request = require('supertest');
const express = require('express');
const apiRouter = require('../../routes/api');
const db = require('../../config/db');
const { apiLogger, buildLogData } = require('../../config/winston');
const auth = require('../../middleware/auth');
const { urlPattern } = require('../../../backend_react/utils/patterns');

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
    req.user = { userId: 1, userEmail: 'test@example.com' };
    next();
});

jest.mock('../../../backend_react/utils/patterns', () => ({
    urlPattern: { test: jest.fn((url) => url === 'https://example.com') },
}));

describe('GET /get/url', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return URL details successfully (expected status 200)', async () => {
        const mockRow = {
            id: 1,
            url: 'https://example.com',
            redirectUrl: 'https://redirect.com',
            urlName: 'example',
            expirationDate: null,
            creationDate: new Date('2050-01-01T00:00:00.000Z'),
            redirectionCount: 5,
        };

        db.query.mockImplementation((query, values, callback) => {
            callback(null, [mockRow]);
        });

        urlPattern.test.mockReturnValue(true);

        const response = await request(app).get('/api/get/url').query({ value: 'https://example.com' });

        const expectedData = {
            ...mockRow,
            creationDate: mockRow.creationDate.toISOString(),
        };
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(expectedData);
        expect(apiLogger.info).toHaveBeenCalledWith('User URL row sent successfully', expect.any(Object));
    });

    it('should return 400 when URL value is not provided (expected status 400)', async () => {
        const response = await request(app).get('/api/get/url').query({ value: '' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please provide a valid URL value');
        expect(apiLogger.warn).toHaveBeenCalledWith('User didn\'t provide a valid URL value', expect.any(Object));
    });

    it('should return 400 when URL value is invalid (expected status 400)', async () => {
        urlPattern.test.mockReturnValue(false);

        const response = await request(app).get('/api/get/url').query({ value: 'invalidUrl' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please provide a valid URL value');
        expect(apiLogger.warn).toHaveBeenCalledWith('User didn\'t provide a valid URL value', expect.any(Object));
    });

    it('should return 403 when URL does not exist or belong to user (expected status 403)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, []);
        });

        urlPattern.test.mockReturnValue(true);

        const response = await request(app).get('/api/get/url').query({ value: 'https://example.com' });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('This URL does not exist or does not belong to you');
        expect(apiLogger.error).toHaveBeenCalledWith('Error selecting User URL row, url doesn\'t exists or belong to user', expect.any(Object));
    });

    it('should return 500 when there is a database error (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Database error'), null);
        });

        urlPattern.test.mockReturnValue(true);

        const response = await request(app).get('/api/get/url').query({ value: 'https://example.com' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');
        expect(apiLogger.error).toHaveBeenCalledWith('Error selecting User URL row', expect.any(Object));
    });
});
