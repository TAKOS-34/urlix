const auth = require('../../middleware/auth');
const db = require('../../config/db');
const { hashApiKey } = require('../../../backend_react/utils/helpers');

jest.mock('../../config/db', () => ({
    query: jest.fn()
}));

jest.mock('../../../backend_react/utils/helpers', () => ({
    hashApiKey: jest.fn()
}));

describe('auth Middleware', () => {
    let req, res, next;
    const apiKey = 'sample-api-key';
    const hashedApiKey = 'hashed-sample-api-key';

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if no API Key is provided', () => {
        auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('API Key missing');
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 500 if a database error occurs', () => {
        req.headers['x-api-key'] = apiKey;
        hashApiKey.mockReturnValue(hashedApiKey);
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error('Database error'), null);
        });

        auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal server error');
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if the API Key is invalid', () => {
        req.headers['x-api-key'] = apiKey;
        hashApiKey.mockReturnValue(hashedApiKey);
        db.query.mockImplementation((query, values, callback) => {
            callback(null, []);
        });

        auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Invalid API Key');
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next and add user info to req.user for a valid API Key', () => {
        req.headers['x-api-key'] = apiKey;
        hashApiKey.mockReturnValue(hashedApiKey);
        db.query.mockImplementation((query, values, callback) => {
            callback(null, [{ id: 1, email: 'test@example.com' }]);
        });

        auth(req, res, next);

        expect(req.user).toEqual({ userId: 1, userEmail: 'test@example.com', apiKey: hashedApiKey });
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });
});
