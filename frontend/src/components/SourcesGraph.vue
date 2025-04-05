<template>
  <div>
    <h2>Electricity Output Over Time</h2>
    <div ref="chart" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';

const chart = ref(null);

// Retrieve the building name from localStorage
const buildingName = localStorage.getItem('selectedBuilding'); // Get the selected building name
console.log(buildingName)

onMounted(async () => {
  if (!buildingName) {
    console.warn('No building selected.');
    return;
  }

  const chartInstance = echarts.init(chart.value); // Initialize the chart instance

  try {
    // Make the GET request with the building name as a URL parameter
    const response = await axios.get(`http://localhost:3000/api/tables/${buildingName}`);
    const data = response.data;

    if (!data || data.length === 0) {
      console.warn('No Athena data available.');
      return;
    }

    // Extract timestamps and electricity output data
    const timestamps = data.map(row => row.timestamp);
    const electricityOut = data.map(row => row.total_kwh || 0); // Use 0 if missing

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
          formatter: value => value.slice(11) // Show only time
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
h2 {
  text-align: center;
  margin-bottom: 1rem;
}
</style>
