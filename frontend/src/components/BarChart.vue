<template>
    <div ref="chart" style="width: 100%; height: 400px;"></div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    name: 'BarChart',
    data() {
      return {
        // Sample data
        chartData: [120, 200, 150, 80, 70, 110, 130],
        chartLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        title: 'Sample Bar Chart'
      };
    },
    mounted() {
      this.renderChart();
    },
    watch: {
      chartData() {
        this.renderChart();
      },
      chartLabels() {
        this.renderChart();
      }
    },
    methods: {
      renderChart() {
        // Initialize ECharts instance
        const chart = echarts.init(this.$refs.chart);
  
        // Prepare chart options
        const options = {
          title: {
            text: this.title,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: this.chartLabels,
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Value',
              type: 'bar',
              data: this.chartData,
              barWidth: '50%',
              itemStyle: {
                color: '#4caf50'
              }
            }
          ]
        };
  
        // Set the options for the chart
        chart.setOption(options);
      }
    }
  };
  </script>
  
  <style scoped>

  </style>
  