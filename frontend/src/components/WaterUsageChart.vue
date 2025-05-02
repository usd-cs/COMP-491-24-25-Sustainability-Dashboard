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
    text: 'Total Water Usage',
    left: 'center'
  },
  color: ['#90CAF9', '#42A5F5', '#1E88E5'],
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Irrigation', 'Domestic', 'Total'],
    bottom: 0
  },
  xAxis: {
    type: 'category',
    data: [ '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023' ],
  },
  yAxis: {
    type: 'value',
    name: 'Gallons of Water'
  },
  series: [
    {
      name: 'Irrigation',
      type: 'bar',
      stack: 'total',
      data: [27553674, 34052075, 27262755, 27439295, 28592044, 35284865, 31733114, 34017665, 38677281, 32333052, 35009332]
    },
    {
      name: 'Domestic',
      type: 'bar',
      stack: 'total',
      data: [64935402, 65912358, 59924202, 56294653, 54065458, 59017563, 57473583, 50964035, 35498060, 48883702, 50321760]
    },
    {
      name: 'Total',
      type: 'line',
      data: [92489075, 99694433, 87186957, 83733949, 82657502, 94302427, 89206697, 84981699, 74175340, 81216754, 85331092]
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