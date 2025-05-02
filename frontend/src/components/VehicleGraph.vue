<template>
    <div class="chart-wrapper">
      <div ref="chart" class="chart-container"></div>
    </div>
  </template>

<script>
import * as echarts from 'echarts';
import { ref, onMounted, nextTick } from 'vue';

const option = {
  title: {
    text: 'Types of Vehicles in Fleet',
    left: 'center'
  },
  color: ['#BDBDBD', '#9E9E9E', '#757575', '#424242'], // gray variants
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: [
      'Gasoline or Diesel-only',
      'Electric-only',
      'Gasoline-electric hybrid',
      'Compressed Natural Gas (CNG)'
    ],
    bottom: 0
  },
  xAxis: {
    type: 'category',
    data: ['2014', '2017', '2021', '2023']
  },
  yAxis: {
    type: 'value',
    name: 'Number of Vehicles'
  },
  series: [
    {
      name: 'Gasoline or Diesel-only',
      type: 'bar',
      data: [86.3, 82.8, 79.8, 0]
    },
    {
      name: 'Electric-only',
      type: 'bar',
      data: [11.5, 15.2, 17.4, 0]
    },
    {
      name: 'Gasoline-electric hybrid',
      type: 'bar',
      data: [1.6, 0, 1.4, 0]
    },
    {
      name: 'Compressed Natural Gas (CNG)',
      type: 'bar',
      data: [0.5, 2, 1.4, 0]
    }
  ]
};

export default {
  setup() {
    const chart = ref(null);

    onMounted(() => {
      nextTick(() => {
        const chartInstance = echarts.init(chart.value);
        chartInstance.setOption(option);
      });
    });

    return { chart };
  }
};
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
}
.chart-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}
</style>