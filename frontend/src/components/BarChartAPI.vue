<template>
    <div class="full-page">
      <div ref="chart" class="chart-container"></div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  const SITE_ID = "81cf1b35a25c3452b54467f32639c00f"; 
  
  export default {
    name: 'BarChart',
    data() {
      return {
        headerToDbColumnMap: {
          'Date (Local)': 'date_local',
          'Heat Rate': 'heat_rate_hhv_btu_per_kwh',
          'Electricity Out': 'electricity_out_kwh',
          'Gas Flow In': 'gas_flow_in_therms',
          'CO₂ Reduction': 'co2_reduction_lbs',
          'CO₂ Production': 'co2_production_lbs',
        },
        chartData: [],
        chartLabels: [],
        title: 'Energy Production & Emissions'
      };
    },
    mounted() {
      this.fetchChartData(); // Fetch data when component mounts
    },
    methods: {
      async fetchChartData() {
        try {
          const data = await fetchEnergyData(SITE_ID);
  
          if (!data) {
            console.error('No data received from API.');
            return;
          }
  
          // Extract relevant fields from API response
          this.chartLabels = Object.keys(this.headerToDbColumnMap).filter(
            label => label !== 'Date (Local)'
          );
  
          this.chartData = this.chartLabels.map(label => {
            const dbColumn = this.headerToDbColumnMap[label];
            return data[dbColumn] || 0; // Use 0 as default if value is missing
          });
  
          this.renderChart();
        } catch (error) {
          console.error('Error fetching chart data:', error.message);
        }
      },
  
      renderChart() {
        const chart = echarts.init(this.$refs.chart);
        this.chartInstance = chart;
  
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
  
        this.chartInstance.setOption(options);
        window.addEventListener('resize', () => this.chartInstance.resize());
      }
    }
  };
  </script>
  
  <style scoped>
  :global(body) {
    background-color: #ffffff;
  }
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
  }
  </style>
  