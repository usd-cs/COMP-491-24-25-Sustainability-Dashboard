<template>
  <div class="chart-wrapper">
    <div v-if="!hasData">No data available for the selected building.</div>
    <div v-else ref="chart" class="chart-container"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { useRoute } from "vue-router";
import * as echarts from 'echarts';
import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const route = useRoute();
const buildingName = route.query.buildingName; // Retrieve the building name from query parameters

const chart = ref(null);
const hasData = ref(false); // Notify user if data is not available
const errorMessage = ref('');


// // Retrieve the building name from localStorage
// const buildingName = localStorage.getItem('selectedBuilding'); // Get the selected building name
// console.log(buildingName)

onMounted(async () => {
  if (!buildingName) {
    console.warn('No building selected.');
    errorMessage.value = 'No building selected.';
    return;
  }
  console.log('Request received:', buildingName);
  try {
    // Make the GET request with the building name as a URL parameter
    const response = await axios.get(`${apiBaseUrl}/api/tables/hourlyenergybybuilding`, {
      params: { buildingName } // Pass buildingName as a query parameter
    });
    const data = response.data;

    if (!data || data.length === 0) {
      console.warn('No Athena data available.');
      hasData.value = false;
      return;
    }

    hasData.value = true; // Set hasData to true if data is available

    // Extract timestamps and electricity output data
    const timestamps = data.map(row => row.timestamp);
    const electricityOut = data.map(row => row.energy_output || 0); // Use 0 if missing

    // Wait for the DOM to be updated before initializing the chart
    await nextTick();

    if (!chart.value) {
      console.error('Chart DOM element is not available.');
      errorMessage.value = 'Failed to initialize the chart.';
      return;
    }

    // Initialize the chart instance
    const chartInstance = echarts.init(chart.value);

    // Configure the chart
    const option = {
      title: {
    text: 'Electricity Output Over Time', // Chart title
    left: 'center', // Center the title horizontally
    top: 'top', // Position the title at the top
    textStyle: {
      fontSize: 16, // Adjust font size
      fontWeight: 'bold'
      }
    },
      tooltip: {
        trigger: 'axis',
        formatter: '{b0}<br />Electricity Out: {c0} kWh'
      },
      xAxis: {
        type: 'category',
        data: timestamps,
        name: 'Timestamp',
        axisLabel: {
          rotate: 45,
          formatter: value => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      },
      yAxis: {
        type: 'value',
        name: 'Electricity Out (kWh)'
      },
      series: [
        {
          data: electricityOut,
          type: 'line',
          smooth: true,
          areaStyle: {},
          name: 'Electricity Out'
        }
      ]
    };

    chartInstance.setOption(option); // Set the chart option
  } catch (error) {
      console.error('Error fetching Athena hourly data:', error);
      errorMessage.value = `Error fetching data: ${error.response ? error.response.data.message : error.message}`;
  }
});
</script>

<style scoped>
.chart-wrapper {
  width: 80%;
  height: 80%;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 8px; /* Match your box rounding */
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container {
  width: 100%;
  height: 100%;
}
</style>

