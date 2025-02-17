<template>
  <div ref="chart" style="width: 100%; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios'; // Assuming you have axios for making API calls

export default {
  name: 'BarChart',
  data() {
    return {
      // Mapping of headers to database columns
      headerToDbColumnMap: {
        'Date (Local)': 'date_local',
        //'Total Output Factor': 'total_output_factor_percent',
        //'AC Efficiency (LHV)': 'ac_efficiency_lhv_percent',
        'Heat Rate (HHV)': 'heat_rate_hhv_btu_per_kwh',
        //'Electricity Out': 'electricity_out_kwh',
        //'Gas Flow In': 'gas_flow_in_therms',
        'CO₂ Reduction': 'co2_reduction_lbs',
        'CO₂ Production': 'co2_production_lbs',
        'NOₓ Reduction': 'nox_reduction_lbs',
        //'NOₓ Production': 'nox_production_lbs',
       // 'SO₂ Reduction': 'so2_reduction_lbs',
       // 'SO₂ Production': 'so2_production_lbs',
      },
      chartData: [],
      chartLabels: [],
      title: 'Energy Production & Emissions'
    };
  },
  mounted() {
    this.fetchChartData();  // Fetch data on mount
  },
  methods: {
    // Fetch the chart data from API
    async fetchChartData() {
      try {
        const response = await axios.get('http://localhost:3000/api/tables/getenergy'); 
        const data = response.data;

        // Set chart labels (exclude the date)
        this.chartLabels = Object.keys(this.headerToDbColumnMap).filter(label => label !== 'Date (Local)');

        // Map the fetched data to the chart data
        this.chartData = this.chartLabels.map(label => {
          const dbColumn = this.headerToDbColumnMap[label];
          return data[dbColumn] || 0;  // If value not found, default to 0
        });

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
      chart.setOption(options);
    }
  }
};
</script>

<style scoped>
</style>
