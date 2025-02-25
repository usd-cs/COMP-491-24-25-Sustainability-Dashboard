import fetch from 'node-fetch';
/*

const BLOOM_API_URL = 'https://portal-api.bloomenergy.com/api/v1/data/site';

const SITE_ID = "81cf1b35a25c3452b54467f32639c00f"

export const getAllData = async (req, res) => {
    const { siteID } = req.params; // Assuming siteID is passed as a URL parameter

    try {
        const response = await fetch(`${BLOOM_API_URL}/${siteID}/data-extract`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.BLOOM_API_KEY}` // Use an API key if required
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ message: 'Failed to retrieve data from Bloom Energy API.' });
    }
};


export const getEnergySummary = async (req, res) => {
    const { siteID } = req.params;

    try {
        const response = await fetch(`${BLOOM_API_URL}/${siteID}/data-extract`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.BLOOM_API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const { summary } = await response.json();
        res.status(200).json(summary);
    } catch (error) {
        console.error('Error fetching energy summary:', error.message);
        res.status(500).json({ message: 'Failed to retrieve energy summary.' });
    }
};


export const getBubbleChart = async (req, res) => {
    const { siteID } = req.params;

    try {
        const response = await fetch(`${BLOOM_API_URL}/${siteID}/data-extract`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.BLOOM_API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const { data } = await response.json();
        const bubbleChartData = data.map(entry => ({
            date: entry.recordedat,
            energy: entry.energy,
            efficiency: entry.efficiency,
            total_output_factor: entry.total_output_factor
        }));

        res.status(200).json(bubbleChartData);
    } catch (error) {
        console.error('Error fetching bubble chart data:', error.message);
        res.status(500).json({ message: 'Failed to retrieve bubble chart data.' });
    }
};
**/