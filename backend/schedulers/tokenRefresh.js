// In tokenRefresh.js (using ES modules)
import cron from 'node-cron';
import fetch from 'node-fetch';

const TOKEN_URL = 'https://portal-api.bloomenergy.com/auth';
const USERNAME = 'kaelananderson';
const PASSWORD = 'Bloom!Senior1';

// Export refreshToken so it can be tested
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

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const data = await response.json();
    // Adjust according to your API response structure (here we assume the token is in data.token)
    const token = data.token;
    console.log(`[${new Date().toISOString()}] Token refreshed successfully.`);
    console.log(`New token: ${token}`);
    return token;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error refreshing token:`, error);
    throw error;
  }
}

// Schedule the token refresh to run once every 24 hours at midnight
cron.schedule('0 0 * * *', () => {
  console.log(`[${new Date().toISOString()}] Running scheduled token refresh...`);
  refreshToken();
});

// Perform an immediate token refresh at startup.
refreshToken();
