const request = require('supertest');
const express = require('express');
const urlRouter = require('../../routes/url');
const db = require('../../config/db');
const geoip = require('geoip-lite');
const userAgent = require('user-agent');
const app = express();
app.use(express.json());
app.use('/', urlRouter);

jest.mock('../../config/db', () => ({
    query: jest.fn()
}));

jest.mock('../../config/winston', () => ({
    urlLogger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
    buildLogDataUrl: jest.fn((req, route) => ({ route })),
}));

jest.mock('geoip-lite');
jest.mock('user-agent');

describe('GET /:url', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should redirect to the redirectUrl (expected status 302)', async () => {
        const mockUrl = {
            id: 1,
            redirectUrl: 'https://example.com',
            password: null,
            expirationDate: null,
        };
        db.query.mockImplementation((query, values, callback) => {
            callback(null, [mockUrl]);
        });
        geoip.lookup.mockReturnValue({ country: 'US' });
        userAgent.parse.mockReturnValue({ name: 'Chrome', version: '90', os: 'Windows' });

        process.env.BACKEND_API_URL = 'http://backendapi';
        const response = await request(app).get('/testurl');

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe(mockUrl.redirectUrl);
    });

    it('should return 404 when URL does not exist (expected status 404)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, []);
        });

        const response = await request(app).get('/nonexistenturl');

        expect(response.status).toBe(404);
        expect(response.text).toBe('No redirection found for this URL');
    });

    it('should return 410 when URL has expired (expected status 410)', async () => {
        const mockUrl = {
            id: 1,
            redirectUrl: 'https://example.com',
            password: null,
            expirationDate: '2023-01-01',
        };
        db.query.mockImplementation((query, values, callback) => {
            callback(null, [mockUrl]);
        });

        const response = await request(app).get('/expiredurl');

        expect(response.status).toBe(410);
        expect(response.text).toBe('This URL has expired');
    });

    it('should send password form when URL has a password (expected status 200)', async () => {
        const mockUrl = {
            id: 1,
            redirectUrl: 'https://example.com',
            password: 'password123',
            expirationDate: null,
        };
        db.query.mockImplementation((query, values, callback) => {
            callback(null, [mockUrl]);
        });

        const response = await request(app).get('/passwordprotectedurl');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Please enter the password to be redirected');
        expect(response.text).toContain('<form id="passwordForm">');
    });

    it('should return an error when a database error occurs (expected status 500)', async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Database error'), null);
        });

        const response = await request(app).get('/testurl');

        expect(response.status).toBe(500);
        expect(response.text).toBe('An error occurred, please try again later');
    });
});
