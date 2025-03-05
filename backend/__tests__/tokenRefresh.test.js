/**
 * @file tokenRefresh.test.js
 * @description Unit tests for the `refreshToken` function defined in tokenRefresh.js
 * Tests include cases for successful token retrieval, handling non-OK API responses, and network errors
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { refreshToken } from '../schedulers/tokenRefresh';
import fetch from 'node-fetch';

// Mock the default export of node-fetch
vi.mock('node-fetch', () => ({
  default: vi.fn()
}));

describe('refreshToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return token on successful API call', async () => {
    const fakeToken = 'fakeToken';
    const fakeResponse = {
      ok: true,
      json: async () => ({ token: fakeToken }),
    };

    // Make the mocked fetch return the fakeResponse
    fetch.mockResolvedValue(fakeResponse);

    const token = await refreshToken();

    // Check that the token is returned and the fetch call is made with the correct arguments
    expect(token).toBe(fakeToken);
    expect(fetch).toHaveBeenCalledWith('https://portal-api.bloomenergy.com/auth', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ username: 'kaelananderson', password: 'Bloom!Senior1' })
    });
  });

  it('should throw an error when API call returns non-OK response', async () => {
    const fakeResponse = {
      ok: false,
      statusText: 'Unauthorized'
    };

    fetch.mockResolvedValue(fakeResponse);

    // Check that the error message is thrown correctly
    await expect(refreshToken()).rejects.toThrow('Token refresh failed: Unauthorized');
  });

  it('should throw an error when fetch rejects (network error)', async () => {
    const fakeError = new Error('Network error');

    fetch.mockRejectedValue(fakeError);

    // Check that the error message is thrown correctly
    await expect(refreshToken()).rejects.toThrow('Network error');
  });
});
