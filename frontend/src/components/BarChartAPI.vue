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
  const fetchData = async (siteID) => {
    if (!token) {
      await getAuthToken(); // If token is not available, get a new one
    }
  
    const response = await fetch(`${BLOOM_API_URL}/${siteID}/data-extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (response.status === 401) {
      // If unauthorized, refresh the token and retry the request
      await getAuthToken();
      return fetchData(siteID); // Retry after refreshing the token
    }
  
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
  
    return response.json();
  };
  
  // Function to get a new token
  const getAuthToken = async () => {
    try {
      const response = await axios.post(
        'https://portal-api.bloomenergy.com/auth',
        {
            username: "kaelananderson",
            password: "Bloom!Senior1"
          //username: import.meta.env.VITE_BLOOMUSERNAME,
          //password: import.meta.env.VITE_BLOOMPASSWORD
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
  
      token = response.data.token;
      console.log('New token obtained:', token);
      localStorage.setItem('authtoken', token); // Store the token in localStorage
  
    } catch (error) {
      console.error('Error getting token:', error.message);
      throw new Error('Authentication failed');
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
        title: 'Energy Production & Emissions'
      };
    },
    async mounted() {
      await this.fetchChartData();
    },
    methods: {
      async fetchChartData() {
        try {
          const response = await fetchData('81cf1b35a25c3452b54467f32639c00f'); // Call the imported fetchData function
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
  