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
    req.user = { userId: 1, userEmail: 'test@example.com', apiKey: 'testApiKey' };
    next();
});

describe('DELETE /delete/:urlId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete URL successfully (expected status 200)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            if (query.includes('DELETE FROM url')) {
                callback(null, { affectedRows: 1 });
            } else if (query.includes('UPDATE api_keys')) {
                callback(null, {});
            }
        });

        const response = await request(app).delete('/api/delete/1');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(apiLogger.info).toHaveBeenCalledWith('User URL deleted successfully', expect.any(Object));
    });

    it('should return 500 when there is a database error (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Database error'), null);
        });

        const response = await request(app).delete('/api/delete/1');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');
        expect(apiLogger.error).toHaveBeenCalledWith('Error deleting user URL', expect.any(Object));
    });

    it('should return 400 when no changes were made (expected status 400)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 0 });
        });

        const response = await request(app).delete('/api/delete/1');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('No changes were made');
        expect(apiLogger.error).toHaveBeenCalledWith('Error deleting user URL, no changes were made', expect.any(Object));
    });
});
