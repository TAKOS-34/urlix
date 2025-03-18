const request = require('supertest');
const express = require('express');
const router = require('../../routes/url');
const db = require('../../config/db');
const geoip = require('geoip-lite');
const userAgent = require('user-agent');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());
app.use('/', router);

jest.mock('../../config/db', () => ({
    query: jest.fn()
}));

jest.mock('../../config/winston', () => ({
    urlLogger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
    buildLogDataUrl: jest.fn((req, route) => ({ route }))
}));

jest.mock('geoip-lite');
jest.mock('user-agent');

describe('POST /:url', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should redirect to the redirectUrl when password is correct (expected status 302)', async () => {
        const mockUrl = {
            id: 1,
            redirectUrl: 'https://example.com',
            password: '$2b$10$hashedpassword',
            expirationDate: null,
        };
        process.env.BACKEND_API_URL = 'http://backendapi';
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, [mockUrl]);
        });
        jest.spyOn(bcrypt, 'compare').mockImplementation((password, hash, callback) => {
            callback(null, true);
        });
        geoip.lookup.mockReturnValue({ country: 'US' });
        userAgent.parse.mockReturnValue({ name: 'Chrome', version: '90', os: 'Windows' });

        const response = await request(app).post('/testurl').send({
            password: 'plaintextpassword'
        });

        expect(response.status).toBe(302);
        expect(response.body).toEqual({ status: true, url: mockUrl.redirectUrl });
    });

    it('should return 404 when URL does not exist (expected status 404)', async () => {
        process.env.BACKEND_API_URL = 'http://backendapi';
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, []);
        });

        const response = await request(app).post('/nonexistenturl').send({
            password: 'anything'
        });

        expect(response.status).toBe(404);
        expect(response.text).toBe('No redirection found for this URL');
    });

    it('should return 410 when URL has expired (expected status 410)', async () => {
        const mockUrl = {
            id: 1,
            redirectUrl: 'https://example.com',
            password: 'hashedpassword',
            expirationDate: '2000-01-01',
        };
        process.env.BACKEND_API_URL = 'http://backendapi';
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, [mockUrl]);
        });

        const response = await request(app).post('/expiredurl').send({
            password: 'any'
        });

        expect(response.status).toBe(410);
        expect(response.text).toBe('This URL has expired');
    });

    it('should return 400 when password is not provided (expected status 400)', async () => {
        const mockUrl = {
            id: 1,
            redirectUrl: 'https://example.com',
            password: 'hashedpassword',
            expirationDate: null,
        };
        process.env.BACKEND_API_URL = 'http://backendapi';
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, [mockUrl]);
        });

        const response = await request(app).post('/nopasswordurl').send({});

        expect(response.status).toBe(400);
        expect(response.text).toBe('Please enter a valid password');
    });

    it('should return 500 when a database error occurs during SELECT (expected status 500)', async () => {
        process.env.BACKEND_API_URL = 'http://backendapi';
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(new Error('Database error'), null);
        });

        const response = await request(app).post('/dberrorurl').send({
            password: 'any'
        });

        expect(response.status).toBe(500);
        expect(response.text).toBe('An error occurred, please try again later');
    });

    it('should return 500 when bcrypt.compare returns an error (expected status 500)', async () => {
        const mockUrl = {
            id: 1,
            redirectUrl: 'https://example.com',
            password: '$2b$10$hashedpassword',
            expirationDate: null,
        };
        process.env.BACKEND_API_URL = 'http://backendapi';
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, [mockUrl]);
        });
        jest.spyOn(bcrypt, 'compare').mockImplementation((password, hash, callback) => {
            callback(new Error('bcrypt error'));
        });

        const response = await request(app).post('/bcrypterrorurl').send({ 
            password: 'plaintextpassword'
        });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ status: false });
    });

    it('should return 400 when password is incorrect (expected status 400)', async () => {
        const mockUrl = {
            id: 1,
            redirectUrl: 'https://example.com',
            password: '$2b$10$hashedpassword',
            expirationDate: null,
        };
        process.env.BACKEND_API_URL = 'http://backendapi';
        db.query.mockImplementationOnce((query, values, callback) => {
            callback(null, [mockUrl]);
        });
        jest.spyOn(bcrypt, 'compare').mockImplementation((password, hash, callback) => {
            callback(null, false);
        });

        const response = await request(app).post('/incorrectpasswordurl').send({
            password: 'wrongpassword'
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ status: false });
    });
});
