<template>
  <div class="full-page">
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

const BLOOM_API_URL = 'https://portal-api.bloomenergy.com/api/v1/data/site';
let token = localStorage.getItem('authtoken'); // Fetch the token from localStorage

// Helper function to fetch data
const fetchData = async (siteID, fromDate) => {
  if (!token) {
    await getAuthToken(); // If token is not available, get a new one
  }

  const response = await fetch(`${BLOOM_API_URL}/${siteID}/data-extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      metrics: ["total_output_factor", "efficiency", "energy", "fuel"],
      timeinterval: "daily",
      timeframe: "custom",
      from: fromDate,  // Pass fromDate here
      to: fromDate     // You can adjust 'to' if needed
    })
  });

  if (response.status === 401) {
    // If unauthorized, refresh the token and retry the request
    await getAuthToken();
    return fetchData(siteID, fromDate); // Retry after refreshing the token
  }

  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }

  return response.json();
};

// Function to get a new token
const getAuthToken = async () => {
  try {
    const response = await axios.post('https://portal-api.bloomenergy.com/auth', 
    {
      "username": import.meta.env.VITE_BLOOMUSERNAME,
      "password": import.meta.env.VITE_BLOOMPASSWORD,
    },
    {
      headers: {
        "Content-Type": "application/json",
      }
    });

    token = response.data.token;
    console.log('New token obtained:', token);
    localStorage.setItem('authtoken', token);
  } catch (error) {
    console.error('Error getting token:', error.message);
    throw new Error('Authentication failed');
  }
};

// New function to fetch the site ID
const fetchSiteID = async () => {
  if (!token) {
    await getAuthToken(); // Ensure the token is available
  }

  try {
    const response = await axios.get('https://portal-api.bloomenergy.com/api/v1/user/sites', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.data || !response.data[0]) {
      throw new Error('No site found');
    }
    localStorage.setItem('siteId', response.data[0].id)
    return response.data[0].id; 
  } catch (error) {
    console.error('Error fetching site ID:', error.message);
    throw new Error('Failed to fetch site ID');
  }
};

export default {
  name: 'BarChart',
  data() {
    return {
      headerToDbColumnMap: {
        'Date (Local)': 'recordedat',
        'Total Output Factor': 'total_output_factor',
        'Efficiency': 'efficiency',
        'Energy': 'energy',
        'Fuel': 'fuel',
        'CO₂ Reduction': 'co2_reduction',
        'NOₓ Reduction': 'nox_reduction',
        'SO₂ Reduction': 'so2_reduction',
        'Battery Charge': 'battery_charge',
        'Battery Discharge': 'battery_discharge',
        'Critical Load Energy': 'critical_load_energy'
      },
      chartData: [],
      chartLabels: [],
      title: 'Energy Production & Emissions',
      siteID: null, // Store site ID here
    };
  },
  async mounted() {
    await this.fetchSiteID();
    await this.fetchChartData();
  },
  methods: {
    // Function to get the current date in YYYY-MM-DD format
    getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Get month and pad to 2 digits
      const day = today.getDate().toString().padStart(2, '0'); // Get day and pad to 2 digits
      return `${year}-${month}-${day}`; // Format the date as YYYY-MM-DD
    },

    async fetchSiteID() {
      try {
        this.siteID = await fetchSiteID(); // Fetch the site ID
        console.log('Fetched Site ID:', this.siteID);
      } catch (error) {
        console.error('Error fetching site ID:', error.message);
      }
    },

    async fetchChartData() {
      if (!this.siteID) {
        console.error('Site ID is not available');
        return;
      }

      try {
        const fromDate = this.getCurrentDate(); // Get the current date
        const response = await fetchData(this.siteID, fromDate); // Use the fetched site ID and current date
        const data = response?.data?.[0]; // Use only the first index

        if (!data) {
          console.error('No data received from API.');
          return;
        }

        this.chartLabels = Object.keys(this.headerToDbColumnMap).filter(
          label => label !== 'Date (Local)'
        );

        this.chartData = this.chartLabels.map(label => {
          const dbColumn = this.headerToDbColumnMap[label];
          return data[dbColumn] || 0; // Use 0 as default if value is missing
        });

        this.renderChart();
      } catch (error) {
        console.error('Error fetching chart data:', error.message);
      }
    },

    renderChart() {
      const chart = echarts.init(this.$refs.chart);
      this.chartInstance = chart;

      const options = {
        title: {
          text: this.title,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.chartLabels,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Value',
            type: 'bar',
            data: this.chartData,
            barWidth: '50%',
            itemStyle: {
              color: '#4caf50'
            }
          }
        ]
      };

      this.chartInstance.setOption(options);
      window.addEventListener('resize', () => this.chartInstance.resize());
    }
  }
};
</script>

<style scoped>
:global(body) {
  background-color: #ffffff;
}
.full-page {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
</style>
