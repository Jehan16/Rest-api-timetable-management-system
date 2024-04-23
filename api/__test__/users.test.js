const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users_signup, users_login } = require('../controllers/users');
const User = require('../models/user');

describe('User Sign-up', () => {
    it('should successfully create a new user', async () => {
        // Mock request and response objects
        const req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
                role: 'student'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock User.find to return an empty array, indicating email is not already in use
        User.find = jest.fn(() => Promise.resolve([]));

        // Mock bcrypt.hash to return hashed password
        const hashedPassword = 'hashedPassword';
        jest.spyOn(bcrypt, 'hash').mockImplementation(async (password, salt) => {
            return hashedPassword;
        });

        // Mock User.save to return saved user data
        const saveMock = jest.spyOn(User.prototype, 'save').mockResolvedValue({
            _id: 'someUserId',
            email: 'test@example.com',
            role: 'student'
        });

        // Call the sign-up function
        await users_signup(req, res);

        // Assertions
        expect(User.find).toHaveBeenCalledWith({ email: req.body.email });
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
        expect(saveMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully' });
    });
});

// describe('User Login', () => {
//     it('should successfully login a user', async () => {
//         // Mock request and response objects
//         const req = {
//             body: {
//                 email: 'test@example.com',
//                 password: 'password123'
//             }
//         };
//         const res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };

//         // Mock User.find to return a user with hashed password
//         const mockUser = {
//             _id: 'someUserId',
//             email: 'test@example.com',
//             password: await bcrypt.hash('password123', 10), // Hashed password
//             role: 'student'
//         };
//         User.find = jest.fn(() => Promise.resolve([mockUser]));

//         // Mock bcrypt.compare to always return true
//         jest.spyOn(bcrypt, 'compare').mockImplementation(async (password, hashedPassword) => {
//             return password === hashedPassword;
//         });



//         // Mock jwt.sign to return a mock token
//         jest.spyOn(jwt, 'sign').mockReturnValue('mockToken');

//         // Call the login function
//         await users_login(req, res);

//         // Assertions
//         expect(User.find).toHaveBeenCalledWith({ email: req.body.email });
//         // expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, mockUser.password);
//         expect(jwt.sign).toHaveBeenCalledWith(
//             {
//                 email: mockUser.email,
//                 userId: mockUser._id,
//                 role: mockUser.role
//             },
//             process.env.JWT_KEY,
//             { expiresIn: '1h' }
//         );
//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(res.json).toHaveBeenCalledWith({
//             message: 'Auth successful',
//             token: 'mockToken',
//             userDetails: [{
//                 id: mockUser._id,
//                 email: mockUser.email,
//                 role: mockUser.role
//             }]
//         });
//     });
// });