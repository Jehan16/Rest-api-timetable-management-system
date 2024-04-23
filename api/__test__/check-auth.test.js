const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/check-auth');

// Mocking req, res, and next objects
const mockRequest = (token) => {
    return {
        headers: {
            authorization: token ? `Bearer ${token}` : undefined
        }
    }
}

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

const mockNext = jest.fn();

describe('logged_in_user middleware', () => {
    it('should set userData in req if token is valid', () => {
        const req = mockRequest('validToken');
        const res = mockResponse();
        
        // Mocking the verify function of jwt to return some decoded user data
        jwt.verify = jest.fn().mockReturnValue({ userId: 'someUserId', role: 'user' });

        authMiddleware.logged_in_user(req, res, mockNext);

        expect(req.userData).toBeDefined();
        expect(req.userData.userId).toBe('someUserId');
        expect(req.userData.role).toBe('user');
        expect(mockNext).toHaveBeenCalled();
    })

    it('should return 401 if token is missing', () => {
        const req = mockRequest(undefined);
        const res = mockResponse();

        authMiddleware.logged_in_user(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Auth failed' })
    })

    it('should return 401 if token is invalid', () => {
        const req = mockRequest('invalidToken')  
        const res = mockResponse()

        // Mocking the verify function of jwt to throw an error (indicating invalid token)
        jwt.verify = jest.fn().mockImplementation(() => { throw new Error() })

        authMiddleware.logged_in_user(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Auth failed' })
    })
})

describe('restrict middleware', () => {
    it('should call next if user role matches the specified role', () => {
        const req = { userData: { role: 'admin' } }
        const res = mockResponse()

        const next = jest.fn()

        authMiddleware.restrict('admin')(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    it('should return 403 if user role does not match the specified role', () => {
        const req = { userData: { role: 'user' } }
        const res = mockResponse()

        const next = jest.fn()

        authMiddleware.restrict('admin')(req, res, next)

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'You do not have permission to perform this action' })
    })

    it('should return 403 if user role is not provided', () => {
        const req = { userData: {} }
        const res = mockResponse()

        const next = jest.fn()

        authMiddleware.restrict('admin')(req, res, next)

        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({ message: 'You do not have permission to perform this action' })
    })
})
