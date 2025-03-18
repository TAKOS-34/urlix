const request = require('supertest');
const express = require('express');
const apiRouter = require('../../routes/api');
const db = require('../../config/db');
const { apiLogger, buildLogData } = require('../../config/winston');
const auth = require('../../middleware/auth');

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

describe('GET /get/all', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all URLs successfully (expected status 200)', async () => {
        const mockRows = [
            {
                id: 1,
                url: 'https://example.com',
                redirectUrl: 'https://redirect.com',
                urlName: 'example',
                expirationDate: null,
                creationDate: new Date(),
                redirectionCount: 5,
            },
        ];

        db.query.mockImplementation((query, values, callback) => {
            callback(null, mockRows);
        });

        const response = await request(app).get('/api/get/all');

        const expectedData = mockRows.map(row => ({
            ...row,
            creationDate: row.creationDate.toISOString(),
        }));
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(expectedData);
        expect(apiLogger.info).toHaveBeenCalledWith('User URL rows sent successfully', expect.any(Object));
    });

    it('should return 500 when there is a database error (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Database error'), null);
        });

        const response = await request(app).get('/api/get/all');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');
        expect(apiLogger.error).toHaveBeenCalledWith('Error selecting URL rows', expect.any(Object));
    });
});
