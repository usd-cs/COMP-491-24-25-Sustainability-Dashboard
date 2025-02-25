import axios from 'axios';
/* 

const AUTH_URL = 'https://portal-api.bloomenergy.com/auth';
const DATA_URL = 'https://portal-api.bloomenergy.com/api/v1/data/site/{siteID}/data-extract';

let token = null;
let tokenExpiry = null;

// Function to get a new token
const getAuthToken = async () => {
    try {
        const response = await axios.post(AUTH_URL, {
            username: process.env.BLOOM_USERNAME,
            password: process.env.BLOOM_PASSWORD,
        });

        token = response.data.token;
        tokenExpiry = Date.now() + 2 * 60 * 60 * 1000; // 2 hours from now
        console.log('New token obtained:', token);
    } catch (error) {
        console.error('Error getting token:', error.message);
        throw new Error('Authentication failed');
    }
};

// Function to fetch data
const fetchEnergyData = async (siteID) => {
    if (!token || Date.now() >= tokenExpiry) {
        await getAuthToken();
    }

    try {
        const response = await axios.post(DATA_URL.replace('{siteID}', siteID), {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching energy data:', error.message);
        throw new Error('Failed to retrieve data.');
    }
};

export { fetchEnergyData };
*/