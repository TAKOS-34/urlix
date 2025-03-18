const jwt = require('jsonwebtoken');
const jwtAuth = require('../../middleware/jwtAuth'); 

describe('jwtAuth Middleware', () => {
    let req, res, next;
    const fakeToken = 'fake.token.value';

    beforeEach(() => {
        req = { cookies: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            clearCookie: jest.fn(),
        };
        next = jest.fn();
        process.env.JWT_SECRET = 'testsecret';
    });

    it('should return 401 if no token is provided', () => {
        jwtAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: false,
            message: 'An error occurred, please try again later'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 and clear the cookie if jwt.verify returns an error', () => {
        req.cookies.auth_token = fakeToken;
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(new Error('invalid token'), null);
        });

        jwtAuth(req, res, next);

        expect(res.clearCookie).toHaveBeenCalledWith('auth_token');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: false,
            message: 'Invalid token, please try again later'
        });
        expect(next).not.toHaveBeenCalled();
        jwt.verify.mockRestore();
    });

    it('should return 401 and clear the cookie if the decoded token is incomplete', () => {
        req.cookies.auth_token = fakeToken;
        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(null, {}); 
        });

        jwtAuth(req, res, next);

        expect(res.clearCookie).toHaveBeenCalledWith('auth_token');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: false,
            message: 'Invalid token, please try again later'
        });
        expect(next).not.toHaveBeenCalled();
        jwt.verify.mockRestore();
    });

    it('should call next and add decoded token to req.user for a valid token', () => {
        req.cookies.auth_token = fakeToken;
        const decoded = { userId: '123', userEmail: 'test@example.com' };

        jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
            callback(null, decoded);
        });

        jwtAuth(req, res, next);

        expect(req.user).toEqual(decoded);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        jwt.verify.mockRestore();
    });
});