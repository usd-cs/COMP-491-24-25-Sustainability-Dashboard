/**
 * @file tokenRefresh.js
 * @description Script that handles fetching and refreshing an API authentication token 
 * It exports the `refreshToken` function, which makes a POST request to obtain a token and logs the result
 * Additionally, it schedules a daily token refresh using a cron job, while skipping these side effects during testing
 */

import cron from 'node-cron';
import fetch from 'node-fetch';

const TOKEN_URL = 'https://portal-api.bloomenergy.com/auth';
const USERNAME = 'kaelananderson';
const PASSWORD = 'Bloom!Senior1';

/**
 * Fetches a new API authentication token
 *
 * Makes a POST request to the authentication endpoint with preset credentials
 * Logs the result and returns the token on success; logs and throws an error on failure
 *
 * @returns {Promise<string>} The new API token.
 * @throws {Error} If the token refresh fails or a network error occurs.
 */
export async function refreshToken() {
  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ username: USERNAME, password: PASSWORD })
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const data = await response.json();
    // we assume the token is in data.token
    const token = data.token;
    console.log(`[${new Date().toISOString()}] Token refreshed successfully.`);
    console.log(`New token: ${token}`);
    return token;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error refreshing token:`, error);
    throw error;
  }
}

// Only start the scheduled and immediate refresh when not in test environment
if (process.env.NODE_ENV !== 'test') {

  // Schedule the token refresh to run once every 24 hours at midnight
  cron.schedule('0 0 * * *', () => {
    console.log(`[${new Date().toISOString()}] Running scheduled token refresh...`);
    refreshToken();
  });

  // Perform an immediate token refresh at startup
  refreshToken();
}
