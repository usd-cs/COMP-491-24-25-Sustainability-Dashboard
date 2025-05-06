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
    text: 'Waste Disposal Trends',
    left: 'center'
  },
  color: ['#A1887F', '#8D6E63', '#5D4037'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['Landfill', 'Diverted', 'Total'],
    bottom: 0
  },
  xAxis: {
    type: 'category',
    data: ['2018', '2019', '2020', '2021', '2022']
  },
  yAxis: {
    type: 'value',
    name: 'Tons'
  },
  series: [
    {
      name: 'Landfill',
      type: 'bar',
      data: [2565.194, 2097.198, 1657.656, 0, 2030.81]
    },
    {
      name: 'Diverted',
      type: 'bar',
      data: [764.7535, 786.751, 667.5515, 0, 861.24]
    },
    {
      name: 'Total',
      type: 'line',
      data: [3329.9475, 2883.949, 2325.2075, 0, 2892.05]
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