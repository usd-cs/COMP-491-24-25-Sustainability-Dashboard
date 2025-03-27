<template>
  <div class="full-page">
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'PieChart',
  data() {
    return {
      chartData: [],
      title: 'Emissions Production Distribution'
    };
  },
  mounted() {
    this.fetchChartData();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    async fetchChartData() {
      try {
        const response = await axios.get('http://localhost:3000/api/tables/getenergy');
        const data = response.data;
        console.log('API Response:', data);
        // Transform data for pie chart format
        this.chartData = [
          {
            name: 'CO₂ Production',
            value: parseFloat(data.co2_production_lbs),
            itemStyle: { color: '#FF6B6B' }
          },
          {
            name: 'Electricity Production',
            value: parseFloat(data.electricity_out_kwh),
            itemStyle: { color: '#4ECDC4' }
          },
          {
            name: 'Gas Flow',
            value: parseFloat(data.gas_flow_in_therms),
            itemStyle: { color: '#45B7D1' }
          }
        ];
        // Log the transformed data
        console.log('Chart Data:', this.chartData);

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
          left: 'center',
          top: '5%'
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            const unit = params.name.includes('Electricity') ? 'kWh' : 'lbs';
            return `${params.name}: ${params.value} ${unit} (${params.percent}%)`;
          }
        },
        legend: {
          orient: 'horizontal',
          bottom: '5%',
          left: 'center',
          padding: [15, 0, 0, 0]
        },
        series: [
          {
            name: 'Emissions',
            type: 'pie',
            radius: ['40%', '70%'], // Creates a donut chart
            center: ['50%', '50%'],  // Center the pie chart
            startAngle: 45, // Start angle at 90 degrees
            avoidLabelOverlap: false, // Disable auto-adjustment
            label: {
              show: true,
              formatter: '{b}: {d}%',
              position: 'outside',
              alignTo: 'labelLine',
              margin: 5,
              distanceToLabelLine: 5 // Add small distance between label and line
            },
            labelLayout: {
              hideOverlap: true,
              moveOverlap: 'shiftY'
            },
            labelLine: {
              length: 10,  // Reduce first segment length
              length2: 10, // Reduce second segment length
              smooth: true,
              minTurnAngle: 45 // Add minimum turn angle for smoother lines
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: this.chartData
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
}
</style>
