// tokenRefresh.test.js

import { describe, it, expect, beforeAll } from 'vitest';
import fetch from 'node-fetch';
import { refreshToken } from '../schedulers/tokenRefresh.js'; // Ensure refreshToken returns the token

// URL for testing token validity (e.g., retrieving user sites)
const USER_SITES_URL = 'https://portal-api.bloomenergy.com/api/v1/user/sites';

describe('Token Refresh Module', () => {
  let token = null;

  // Before running tests, refresh the token and store it.
  beforeAll(async () => {
    // We expect refreshToken() to return a promise that resolves to the token.
    token = await refreshToken();
  });

  it('should retrieve a token', () => {
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should be a valid token by calling the API', async () => {
    const response = await fetch(USER_SITES_URL, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${token}`,
      },
    });
    // Expect a 200 OK response for a valid token
    expect(response.status).toBe(200);
    
    const data = await response.json();
    // We assume the API returns an array of site objects.
    expect(Array.isArray(data)).toBe(true);
  });
});
