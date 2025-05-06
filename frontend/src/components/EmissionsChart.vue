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
    text: 'Total Greenhouse Gas Emissions',
    left: 'center'
  },
  color: ['#A5D6A7', '#66BB6A', '#43A047', '#2E7D32'],
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Scope 1', 'Scope 2', 'Scope 3', 'Total'],
    bottom: 0
  },
  xAxis: {
    type: 'category',
    data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
  },
  yAxis: {
    type: 'value',
    name: 'MT CO₂e'
  },
  series: [
    {
      name: 'Scope 1',
      type: 'bar',
      stack: 'total',
      data: [6459, 5559, 5469, 5056, 4598, 4049, 0, 4399, 4066, 3990]
    },
    {
      name: 'Scope 2',
      type: 'bar',
      stack: 'total',
      data: [9906, 7884, 8122, 8649, 8407, 8342, 0, 6774, 6609, 6554]
    },
    {
      name: 'Scope 3',
      type: 'bar',
      stack: 'total',
      data: [13937, 14607, 14612, 14795, 14566, 13916, 0, 14480, 13175, 14476]
    },
    {
      name: 'Total',
      type: 'line',
      data: [30301, 28049, 28203, 28500, 27571, 26308, 0, 24901, 23851, 25020]
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