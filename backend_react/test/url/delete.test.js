const request = require('supertest');
const express = require('express');
const urlRouter = require('../../routes/url');
const db = require('../../config/db');
const app = express();
app.use(express.json());
app.use('/url', urlRouter);

jest.mock('../../middleware/jwtAuth', () => (req, res, next) => {
    req.user = { userId: 1, userEmail: 'test@example.com' };
    next();
});

jest.mock('../../config/db', () => ({
    query: jest.fn()
}));

jest.mock('../../config/winston', () => ({
    urlLogger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
    buildLogData: jest.fn((email, req, route) => ({ email, route }))
}));

describe('DELETE /url/delete/:urlId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error when URL ID is missing (expected status 404)', async () => {
        const response = await request(app).delete('/url/delete/').send();
        expect(response.status).toBe(404);
    });

    it('should return an error when database delete fails (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Database error'), null);
        });
        const response = await request(app).delete('/url/delete/1').send();
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ status: false, message: 'An error occurred, please try again later' });
    });

    it('should delete the URL successfully (expected status 200)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });
        const response = await request(app).delete('/url/delete/1').send();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: true, message: 'URL deleted, redirection...' });
    });
});
