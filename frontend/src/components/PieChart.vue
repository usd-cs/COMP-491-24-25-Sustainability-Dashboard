<template>
  <div class="chart-wrapper">
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
      title: 'Solar Energy Contributions by Site'
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
        const response = await axios.get('http://localhost:3000/api/tables/energy/solar/contributions');
        this.chartData = response.data.map(item => ({
          name: item.site,
          value: parseFloat(item.total_kwh.toFixed(2))
        }));
        this.renderChart();
      } catch (error) {
        console.error('Error fetching solar contributions:', error);
      }
    },
    renderChart() {
      const names = this.chartData.map(i => i.name);
      const mid = Math.ceil(names.length / 2);
      const leftNames = names.slice(0, mid);
      const rightNames = names.slice(mid);

      this.chartInstance = echarts.init(this.$refs.chart);
      const options = {
        // Distinct palette without any brown tones
        color: [
          '#5470C6', '#91CC75', '#FAC858', '#EE6666',
          '#73C0DE', '#3BA272', '#FC8452', '#9A60B4',
          '#5A9BD4', '#50C878',
          '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF'
        ],
        title: {
          text: this.title,
          left: 'center',
          top: '2%'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} kWh ({d}%)'
        },
        legend: [
          {
            orient: 'vertical',
            left: '5%',
            top: 'center',
            data: leftNames
          },
          {
            orient: 'vertical',
            right: '5%',
            top: 'center',
            data: rightNames
          }
        ],
        series: [
          {
            name: 'Solar Output',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '55%'],
            avoidLabelOverlap: false,
            label: { show: false },
            labelLine: { show: false },
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
      this.chartInstance.setOption(options);
    },
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    }
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
  border-radius: 8px;
  background: #ffffff;
  box-sizing: border-box;
}
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
