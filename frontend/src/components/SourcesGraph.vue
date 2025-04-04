<template>
    <div>
      <h2>Electricity Output Over Time</h2>
      <div ref="chart" style="width: 100%; height: 400px;"></div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import * as echarts from 'echarts';
  
  const chart = ref(null);
  
  onMounted(() => {
    const chartInstance = echarts.init(chart.value);
  
    // Get and parse data from localStorage
    const rawData = localStorage.getItem('energyData');
    if (!rawData) {
      console.warn('No data found in localStorage.');
      return;
    }
  
    const data = JSON.parse(rawData);
  
    // Extract labels and values
    const dates = data.map(row => row.date_local);
    const electricityOut = data.map(row => row.electricity_out_kwh);
  
    // Configure the chart
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b0}<br />Electricity Out: {c0} kWh'
      },
      xAxis: {
        type: 'category',
        data: dates,
        name: 'Date',
        axisLabel: {
          rotate: 45,
          formatter: value => value.slice(5) // Show MM-DD for readability
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
  
    chartInstance.setOption(option);
  });
  </script>
  
  <style scoped>
  h2 {
    text-align: center;
    margin-bottom: 1rem;
  }
  </style>
  