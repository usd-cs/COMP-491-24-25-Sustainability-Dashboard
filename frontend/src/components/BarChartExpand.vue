<template>
  <div class="chart-with-details">
    <!-- X Button to close and navigate back -->
    <button class="close-btn" @click="goToMain">X</button>

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
    };
  },
  mounted() {
    this.extractChartData();
    // Trigger resize to ensure chart fits properly
    this.$nextTick(() => {
      this.$refs.barChart.chartInstance.resize();
    });
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
      }, 500);
    },
    goToMain() {
      this.$router.push('/main'); // Redirect to /main
    }
  }
};
</script>

<style scoped>


/* Ensure the page takes full height */
html, body, .page-container {
  height: 100%;
  margin: 0;
  background-color: white;
}

.chart-with-details {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  height: 100%; /* Ensure this container takes full height */
}

.chart-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.accordion {
  margin-top: 30px;
  font-size: 16px;
  background: white; /* Set accordion background to white */
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
  background-color: white; /* Set the content background to white */
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

/* X Button */
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #007bff; /* Set a visible background color */
  color: white; /* Make text white */
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #0056b3; /* Darken the button on hover */
}

.close-btn:focus {
  outline: none; /* Remove focus outline for a cleaner look */
}
</style>
