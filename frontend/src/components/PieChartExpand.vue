<template>
  <div class="chart-with-details">
    <!-- X Button to close and navigate back -->
    <button class="close-btn" @click="navigateBack">X</button>

    <div ref="chart" class="chart-container"></div>

    <!-- Accordions for Each Pie Slice -->
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
      title: 'Emissions Production Distribution',
      chartInstance: null,
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

        this.chartData = [
          {
            name: 'CO₂ Production',
            value: parseFloat(data.co2_production_lbs),
            percent: 0,
            itemStyle: { color: '#FF6B6B' },
            unit: 'lbs',
          },
          {
            name: 'Electricity Production',
            value: parseFloat(data.electricity_out_kwh),
            percent: 0,
            itemStyle: { color: '#4ECDC4' },
            unit: 'kWh',
          },
          {
            name: 'Gas Flow',
            value: parseFloat(data.gas_flow_in_therms),
            percent: 0,
            itemStyle: { color: '#45B7D1' },
            unit: 'therms',
          },
        ];

        const total = this.chartData.reduce((sum, item) => sum + item.value, 0);
        this.chartData.forEach(item => {
          item.percent = ((item.value / total) * 100).toFixed(2);
        });

        this.renderChart();
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    },
    renderChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        title: {
          text: this.title,
          left: 'center',
          top: '5%',
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            return `${params.name}: ${params.value} ${params.data.unit} (${params.percent}%)`;
          },
        },
        legend: {
          orient: 'horizontal',
          bottom: '5%',
          left: 'center',
        },
        series: [
          {
            name: 'Emissions',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            startAngle: 45,
            label: {
              show: true,
              formatter: '{b}: {d}%',
              position: 'outside',
            },
            labelLine: {
              length: 10,
              length2: 10,
              smooth: true,
              minTurnAngle: 45,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            data: this.chartData,
          },
        ],
      });
    },
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    },
    navigateBack() {
      this.$router.push('/main');
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  height: 100%;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}

.accordion {
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #ddd;
  color: #003b70;
}

.accordion-content {
  margin-top: 10px;
  padding-left: 10px;
  background-color: white;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #FF6B6B;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #FF2C2C;
}
</style>
