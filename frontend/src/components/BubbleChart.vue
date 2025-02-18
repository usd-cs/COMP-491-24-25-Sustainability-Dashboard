<template>
  <div ref="chart" style="width: 100%; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios'; // Assuming you have axios for making API calls

export default {
  name: 'BubbleChart',
  data() {
    return {
      chartData: [],
      title: 'Energy Production Bubble Chart'
    };
  },
  mounted() {
    this.fetchChartData();  // Fetch data on mount
  },
  methods: {
    // Fetch the chart data from API
    async fetchChartData() {
      try {
        const response = await axios.get('http://localhost:3000/api/tables/getbubblechart'); 
        const data = response.data;

        // Map the fetched data to the chart data
        this.chartData = data.map(item => [
          parseFloat(item.electricity_out_kwh),
          parseFloat(item.heat_rate_hhv_btu_per_kwh),
          parseFloat(item.gas_flow_in_therms),
          parseFloat(item.co2_production_lbs)
        ]);

        console.log('Chart Data:', this.chartData); // Log the chart data for debugging

        // Render the chart with fetched data
        this.renderChart();
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    },
    
    renderChart() {
      const chart = echarts.init(this.$refs.chart);
      const options = {
        title: {
          text: this.title,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return `Electricity Out: ${params.value[0]} kWh<br/>
                    Heat Rate: ${params.value[1]} BTU/kWh<br/>
                    Gas Flow: ${params.value[2]} Therms<br/>
                    CO₂ Production: ${params.value[3]} lbs`;
          }
        },
        xAxis: {
          type: 'value',
          name: 'Electricity Out (kWh)'
        },
        yAxis: {
          type: 'value',
          name: 'Heat Rate (BTU/kWh)'
        },
        visualMap: {
          min: Math.min(...this.chartData.map(item => item[3])),
          max: Math.max(...this.chartData.map(item => item[3])),
          dimension: 3,
          inRange: {
            color: ['#d94e5d', '#eac736', '#50a3ba']
          },
          text: ['High CO₂', 'Low CO₂'],
          calculable: true
        },
        series: [
          {
            name: 'Bubble',
            type: 'scatter',
            data: this.chartData.map(item => [item[0], item[1], item[2], item[3]]),
            symbolSize: function (data) {
              return data[2] / 5; // Adjust the size of the bubbles
            },
            itemStyle: {
              opacity: 0.8
            }
          }
        ]
      };
      chart.setOption(options);
    }
  }
};
</script>

<style scoped>
</style>