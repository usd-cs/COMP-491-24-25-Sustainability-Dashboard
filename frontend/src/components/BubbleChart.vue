<template>
  <div class="full-page">
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import { nextTick } from 'vue';

export default {
  name: 'BubbleChart',
  props: {
    // When fullPage is true, the visualMap (scale) is displayed.
    fullPage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chartData: [],
      title: 'Energy Production Bubble Chart'
    };
  },
  mounted() {
    console.log("fullPage prop:", this.fullPage);
    this.fetchChartData();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    async fetchChartData() {
      try {
        const response = await axios.get('http://localhost:3000/api/tables/getbubblechart');
        const data = response.data;
        // Map each record to an array of values.
        this.chartData = data.map(item => [
        parseFloat(item.nox_reduction_lbs).toFixed(3),    // x-axis
          parseFloat(item.co2_reduction_lbs).toFixed(3),
          parseFloat(item.electricity_out_kwh).toFixed(3)   // bubble size
        ]);
        console.log('Chart Data:', this.chartData);
        // Ensure the chart container is rendered before initializing the chart.
        nextTick(() => {
          this.renderChart();
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
        this.chartData = []; // Reset chartData on error
      }
    },
    renderChart() {
      const chart = echarts.init(this.$refs.chart);
      const options = {
        title: {
          text: 'Emissions Reduction Analysis',
          left: 'center',
          padding: [15, 0, 0, 0]
        },
        // grid: {
        //   containLabel: true
        // },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return `NOx Reduction: ${params.value[0]} lbs<br/>
                    CO₂ Reduction: ${params.value[1]} lbs<br/>
                    Electricity Output: ${params.value[2]} kWh`;
          }
        },
        xAxis: {
          type: 'value',
          name: 'NOx Reduction (lbs)',
          nameLocation: 'middle',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          name: 'CO₂ Reduction (lbs)'
        },
        visualMap: {
          // Only show the scale when fullPage is true.
          show: this.fullPage,
          min: Math.min(...this.chartData.map(item => item[2])),
          max: Math.max(...this.chartData.map(item => item[2])),
          dimension: 2,
          inRange: {
            color: ['#d94e5d', '#eac736', '#50a3ba']
          },
          text: ['High Output', 'Low Output'],
          calculable: true,
          precision: 3,
          right: 'right',
          top: 'middle',
          padding: [0, 10, 0, 0],
          itemWidth: 20,
          itemHeight: 200,
          textStyle: { fontSize: 12 }
        },
        series: [
          {
            name: 'Reductions',
            type: 'scatter',
            data: this.chartData,
            symbolSize: function (data) {
              return Math.sqrt(data[2]) / 10; // Scale bubble size based on electricity output
            },
            itemStyle: { opacity: 0.8 }
          }
        ]
      };
      chart.setOption(options);
      this.chart = chart;
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    }
  }
};
</script>

<style scoped>
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
  /* Remove or comment out the border after debugging */
  /* border: 1px solid red; */
}
</style>
