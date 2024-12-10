/**
 * @file loginUser.test.js
 * @description Unit tests for the `loginUser` function, which handles user authentication.
 * Tests include cases for invalid email/password, successful login, and server errors.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser } from '../auth/controller.js';
import { queryUserByEmail } from '../auth/queries.js'; // Update to match new function
import bcrypt from 'bcrypt';

// Mock the dependencies
vi.mock('../auth/queries');

const bcryptCompareResolved = vi.fn().mockResolvedValue(true);
bcrypt.compare = bcryptCompareResolved; // Mocking bcrypt.compare with a resolved promise

describe('loginUser', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'testuser@example.com', // Updated to test email
        password: 'password123',
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  /**
   * Test: Should return 401 if user is not found.
   */
  it('should return 401 if user is not found', async () => {
    queryUserByEmail.mockResolvedValue([]); // Simulate no user found in DB

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password.' });
  });

  /**
   * Test: Should return 401 if password does not match.
   */
  it('should return 401 if password does not match', async () => {
    queryUserByEmail.mockResolvedValue([
      {
        user_id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
        password_hash: 'hashedpassword',
      },
    ]);
    bcrypt.compare.mockResolvedValue(false); // Simulate password mismatch

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password.' });
  });

  /**
   * Test: Should return 200 and user info if login is successful.
   */
  it('should return 200 and user info if login is successful', async () => {
    queryUserByEmail.mockResolvedValue([
      {
        user_id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
        password_hash: 'hashedpassword',
      },
    ]);
    bcrypt.compare.mockResolvedValue(true); // Simulate password match

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      user: {
        user_id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
      },
    });
  });

  /**
   * Test: Should return 500 if there is a server error.
   */
  it('should return 500 if there is a server error', async () => {
    queryUserByEmail.mockRejectedValue(new Error('Database error')); // Simulate a server error

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error during login.' });
  });
});
