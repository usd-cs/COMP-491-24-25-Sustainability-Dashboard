<template>
  <div class="chart-with-details">
    <!-- X Button to close and navigate back -->
    <button class="close-btn" @click="navigateBack">X</button>

    <div ref="chart" class="chart-container"></div>

    <!-- Accordions for Each Column -->
    <div v-for="(label, index) in chartLabels" :key="index" class="accordion">
      <details>
        <summary>{{ label }}</summary>
        <div class="accordion-content">
          <p>{{ getColumnInfo(label) }}</p>
        </div>
      </details>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'BarChartWithAccordion',
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
      title: 'Energy Production & Emissions',
      chartInstance: null,
    };
  },
  mounted() {
    this.fetchChartData(); // Fetch data on mount
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

        this.chartLabels = Object.keys(this.headerToDbColumnMap);

        // Map the fetched data to the chart data
        this.chartData = this.chartLabels.map(label => {
          const dbColumn = this.headerToDbColumnMap[label];
          return data[dbColumn] || 0; // If value not found, default to 0
        });

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
          top: '5%', // Adjusted to avoid cutting off the title
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: 80, // Increased the top margin to prevent cutoff at the top
          left: 20,
          right: 20,
          bottom: 30,
          containLabel: true,  // ensures labels are never clipped
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
    },

    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    },

    // Get info for each column
    getColumnInfo(label) {
      return `The value of ${label} is based on the corresponding data from the database. For more details, refer to the specific metrics related to the ${label}.`;
    },

    // Redirect to the /main route
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
  position: fixed;
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
