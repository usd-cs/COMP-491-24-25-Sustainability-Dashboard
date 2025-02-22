<template>
  <div class="full-page">
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import * as echarts from 'echarts';

export default defineComponent({
  name: 'PieChart',
  setup() {
    const chart = ref(null); // Reference for the chart div

    const hardcodedData = [
      { name: 'Calpine Energy', value: 15035 },
      { name: 'Bloom Energy Fuel Cell', value: 7281 },
      { name: 'Solar Panels', value: 1593 },
      { name: 'SDG&E', value: 552 }
    ];

    const renderChart = () => {
      if (chart.value) {
        const myChart = echarts.init(chart.value);
        myChart.setOption({
          title: {
            text: 'Energy Sources Distribution',
            left: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} MWh ({d}%)'
          },
          legend: {
            orient: 'horizontal',
            bottom: '0%',
            textStyle: {
              fontSize: 10
            }
          },
          series: [
            {
              name: 'Energy Sources',
              type: 'pie',
              radius: '40%', 
              label: {
                show: true,
                position: 'outside',
                fontSize: 12,
                fontWeight: 'bold',
                formatter: '{b}'
              },
              labelLine: {
                show: true
              },
              data: hardcodedData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 5,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.3)'
                }
              }
            }
          ]
        });
      }
    };

    onMounted(renderChart);

    return { chart };
  }
});
</script>

<style scoped>
.full-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.chart-container {
  width: 80%; 
  height: 400px; 
}
</style>
