<template>
  <div class="chart-wrapper">
    <div ref="chart" class="chart-container"></div>
    
  </div>
</template>


<script>
import * as echarts from 'echarts';
import axios from 'axios'; 

export default {
  name: 'BarChart',
  data() {
    return {
      // Mapping of headers to database columns
      headerToDbColumnMap: {
        'Output Factor': 'total_output_factor_percent',
        'AC Efficiency': 'ac_efficiency_lhv_percent',
        'NOₓ Production': 'nox_production_lbs',
        'SO₂ Reduction': 'so2_reduction_lbs',
      },
      chartData: [],
      chartLabels: [],
      title: 'Energy Production & Emissions'
    };
  },
  mounted() {
    this.fetchChartData(); // Fetch data on mount
  },
  beforeUnmount() {
    if (this.chartInstance) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  },
  methods: {
    // Fetch the chart data from API
    async fetchChartData() {
      try {
        const response = await axios.get('http://localhost:3000/api/tables/getenergy'); 
        const data = response.data;

        this.chartLabels = Object.keys(this.headerToDbColumnMap);

        // Map the fetched data to the chart data
        this.chartData = this.chartLabels.map(label => {
          const dbColumn = this.headerToDbColumnMap[label];
          return data[dbColumn] || 0; // If value not found, default to 0
        });

        // Render the chart with fetched data
        this.renderChart();
      } catch (error) {
        console.error('Error fetching chart data:', error);
        this.chartData = [];  // Reset data on error
      }
    },
    
    renderChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      const options = {
        title: {
          text: this.title,
          left: 'center',
          top: 10
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: 50,
          left: 20,
          right: 20,
          bottom: 30,
          containLabel: true  // ensures labels are never clipped
        },
        xAxis: {
          type: 'category',
          data: this.chartLabels,
          axisLabel: {
            rotate: 38
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
      this.resizeHandler = () => this.chartInstance.resize();
      window.addEventListener('resize', this.resizeHandler);
    }
  }
};
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 8px; /* Match your box rounding */
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container {
  width: 100%;
  height: 100%;
  justify-content: center;
}
</style>