<template>
  <div class="chart-with-details">
    <!-- X Button to close and navigate back -->
    <button class="close-btn" @click="navigateBack">X</button>

    <div ref="chart" class="chart-container"></div>

    <!-- Accordions for Each Slice -->
    <div v-for="item in chartData" :key="item.name" class="accordion">
      <details>
        <summary>{{ item.name }}</summary>
        <div class="accordion-content">
          <p><strong>Value:</strong> {{ item.value }} {{ item.unit }}</p>
          <p><strong>Percentage:</strong> {{ item.percent }}%</p>
        </div>
      </details>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'PieChartWithAccordion',
  data() {
    return {
      chartData: [],
      title: 'Solar Energy Contributions by Site',
      chartInstance: null
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
    navigateBack() {
      this.$router.push('/main');
    },
    async fetchChartData() {
      try {
        const { data } = await axios.get('http://localhost:3000/api/tables/energy/solar/contributions');
        this.chartData = data.map(r => ({
          name: r.site,
          value: parseFloat(r.total_kwh.toFixed(2)),
          percent: 0,
          unit: 'kWh'
        }));
        const total = this.chartData.reduce((sum, itm) => sum + itm.value, 0);
        this.chartData.forEach(itm => {
          itm.percent = ((itm.value / total) * 100).toFixed(2);
        });
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
            left: '20%',
            top: '30%',
            itemWidth: 16,
            itemHeight: 16,
            itemGap: 12,
            textStyle: { fontSize: 14, color: '#333' },
            data: leftNames
          },
          {
            orient: 'vertical',
            right: '20%',
            top: '30%',
            itemWidth: 16,
            itemHeight: 16,
            itemGap: 12,
            textStyle: { fontSize: 14, color: '#333' },
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
              label: { show: true, fontSize: 14, fontWeight: 'bold' },
              itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' }
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
html, body, .chart-with-details {
  height: 100%;
  margin: 0;
  background-color: white;
}
.chart-with-details {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  height: 100%;
  position: relative;
}
.chart-container {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}
.accordion {
  margin-top: 16px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #ddd;
  color: #000;
}
.accordion-content {
  margin-top: 8px;
  padding-left: 10px;
  background-color: white;
  color: #000;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  padding: 0;
  line-height: 36px;
  text-align: center;
  border-radius: 50%;
  background-color: #FF6B6B;
  color: #fff;
  border: none;
  cursor: pointer;
  z-index: 1000;       
  pointer-events: auto; 
}
.close-btn:hover {
  background-color: #FF2C2C;
}
</style>
