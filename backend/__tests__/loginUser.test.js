// loginUser.test.js
import { loginUser } from '../auth/controller.js';
import { queryUserByUsername } from '../auth/queries.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
jest.mock('jsonwebtoken');
const verify = jest.spyOn(jwt, 'verify');
verify.mockImplementation(() => () => ({ verified: 'true' }));

// Mock the dependencies
jest.mock('../auth/queries');

const bcryptCompare = jest.fn().mockRejectedValue(new Error('Random error'));
bcrypt.compare = bcryptCompare; // Mocking bcrypt.compare with a rejected promise

// Call method that uses bcrypt.compare with async

const bcryptCompareResolved = jest.fn().mockResolvedValue(true);
bcrypt.compare = bcryptCompareResolved; // Mocking bcrypt.compare with a resolved promise



describe('loginUser', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        password: 'password123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 401 if user is not found', async () => {
    queryUserByUsername.mockResolvedValue([]); // Simulate no user found in DB

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
  });

  it('should return 401 if password does not match', async () => {
    queryUserByUsername.mockResolvedValue([{ user_id: 1, username: 'testuser', password: 'hashedpassword' }]);
    bcrypt.compare.mockResolvedValue(false); // Simulate password mismatch

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
  });

  it('should return 200 and user info if login is successful', async () => {
    queryUserByUsername.mockResolvedValue([{ user_id: 1, username: 'testuser', password: 'hashedpassword' }]);
    bcrypt.compare.mockResolvedValue(true); // Simulate password match
    jwt.sign.mockReturnValue('mockedJWTToken'); // Mock JWT token generation

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      user: { user_id: 1, username: 'testuser' },
    });
  });

  it('should return 500 if there is a server error', async () => {
    queryUserByUsername.mockRejectedValue(new Error('Database error')); // Simulate a server error

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});
