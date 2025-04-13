<template>
    <div class="chart-with-details">
      <BarChart ref="barChart" />
  
      <!-- Individual Accordions for Each Column -->
    <div v-for="(dbColumn, label) in headerToDbColumnMap" :key="label" class="accordion">
      <details>
        <summary>{{ label }}</summary>
        <div class="accordion-content">
          <p><strong>{{ label }}:</strong> {{ chartData[label] ?? 'N/A' }}</p>
        </div>
      </details>
    </div>
  
      <div class="last-updated">
        Last Updated: {{ lastUpdated || 'Not yet uploaded' }}
      </div>
    </div>
  </template>
  
  <script>
  import BarChart from './BarChart.vue';
  
  export default {
    name: 'BarChartExpand',
    components: {
      BarChart
    },
    data() {
      return {
        headerToDbColumnMap: {
          'Output Factor': 'total_output_factor_percent',
          'AC Efficiency': 'ac_efficiency_lhv_percent',
          'NOₓ Production': 'nox_production_lbs',
          'SO₂ Reduction': 'so2_reduction_lbs',
        },
        chartData: {},
        lastUpdated: null // This will hold the upload timestamp
      };
    },
    mounted() {
      this.extractChartData();
    },
    methods: {
      extractChartData() {
        const chart = this.$refs.barChart;
  
        // Delay to ensure chart data is loaded
        setTimeout(() => {
          const labels = chart.chartLabels;
          const data = chart.chartData;
          const mapped = {};
  
          labels.forEach((label, i) => {
            mapped[label] = data[i];
          });
  
          this.chartData = mapped;
  
          // Simulate setting the upload date on mount
          this.lastUpdated = new Date().toLocaleString();
        }, 500);
      }
    }
  };
  </script>
  

  <style scoped>
  .chart-with-details {
    padding: 20px;
    background: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  }
  
  .accordion {
    margin-top: 20px;
    font-size: 16px;
    background: #fff;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    border: 1px solid #ddd;
    color: #003b70;
  }
  
  .accordion-content {
    margin-top: 10px;
    padding-left: 10px;
    color: #003b70;
  }
  
  .accordion-content ul {
    list-style: none;
    padding-left: 0;
  }
  
  .last-updated {
    margin-top: 12px;
    font-size: 14px;
    color: #666;
  }
  </style>
  