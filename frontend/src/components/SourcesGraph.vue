<template>
  <div class="chart-wrapper">
    <h2>Electricity Output Over Time</h2>
    <div v-if="!hasData">No data available for the selected building.</div>
    <div v-else ref="chart" class="chart-container"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from "vue-router";
import * as echarts from 'echarts';
import axios from 'axios';

const route = useRoute();
const buildingName = route.query.buildingName; // Retrieve the building name from query parameters

const chart = ref(null);
const hasData = ref(false); // Notify user if data is not available


// // Retrieve the building name from localStorage
// const buildingName = localStorage.getItem('selectedBuilding'); // Get the selected building name
// console.log(buildingName)

onMounted(async () => {
  if (!buildingName) {
    console.warn('No building selected.');
    return;
  }

  const chartInstance = echarts.init(chart.value); // Initialize the chart instance

  try {
    // Make the GET request with the building name as a URL parameter
    const response = await axios.get(`http://localhost:3000/api/tables/hourlyenergybybuilding`, {
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

    // Configure the chart
    const option = {
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
  }
});
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  padding: 15px;
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
