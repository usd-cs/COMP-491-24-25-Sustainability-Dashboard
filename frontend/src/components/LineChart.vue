<template>
  <div class="chart-wrapper">
    <div class="controls" @click.stop>
      <label for="periodSelect" class="period-label">Select Timeframe:</label>
      <select 
        id="periodSelect" 
        v-model="selectedPeriod" 
        @change="fetchData" 
        @click.stop 
        class="period-select"
      >
        <option value="1 week">1 Week</option>
        <option value="1 month">1 Month</option>
        <option value="3 months">3 Months</option>
        <option value="6 months">6 Months</option>
        <option value="1 year">1 Year</option>
        <option value="lifetime">Lifetime</option>
      </select>
    </div>
    <div class="chart-container" ref="chartContainer">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';
import outputIcon from '@/assets/output-onlinepngtools.png';

// Build the pictorial icon from your local image.
const pictorialIcon = 'image://' + outputIcon;

// Reactive state
const chartContainer = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedPeriod = ref("1 month"); // default is "1 month"

// Chart instance and energy values
let chart = null;
let isMounted = true;
let lifetimeEnergy = 0;
let periodEnergy = 0;

// Fetch data from your backend API
async function fetchData() {
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.get(
      `http://localhost:3000/api/tables/gettreedata?period=${encodeURIComponent(selectedPeriod.value)}`
    );
    console.log("API response:", response.data);
    const data = response.data[0];
    if (!data || data.lifetime_energy == null || data.period_energy == null) {
      throw new Error('Incomplete energy data available');
    }
    lifetimeEnergy = Number(data.lifetime_energy);
    periodEnergy = Number(data.period_energy);

    if (lifetimeEnergy === 0) {
      throw new Error('Lifetime energy is zero.');
    }

    updateChart();
  } catch (err) {
    console.error('Error fetching energy data:', err);
    error.value = err.message || 'Failed to load energy data';
  } finally {
    loading.value = false;
  }
}

function updateChart() {
  const formattedLifetime = lifetimeEnergy.toLocaleString();
  const formattedPeriod = periodEnergy.toLocaleString();

  const option = {
    // Title with dark text
    title: {
      text: 'Campus Renewable Energy Output',
      subtext: `Lifetime: ${formattedLifetime} kWh  |  ${selectedPeriod.value} : ${formattedPeriod} kWh`,
      left: 'center',
      textStyle: {
        color: '#333',     // Darker text
        fontSize: 24
      },
      subtextStyle: {
        color: '#444',     // Darker text for subtext
        fontSize: 16,
        lineHeight: 24
      }
    },
    // Dark text for tooltip
    tooltip: {
      trigger: 'axis',
      textStyle: { color: '#333' },
      formatter: '{b}: {c} kWh'
    },
    // White background
    backgroundColor: '#fff',
    xAxis: {
      max: lifetimeEnergy,
      splitLine: { show: false },
      axisLine: { lineStyle: { color: '#333' } },    // Dark axis line
      axisLabel: {
        margin: 10,
        color: '#333',                               // Dark axis labels
      }
    },
    yAxis: {
      data: ['Campus'],
      inverse: true,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        margin: 10,
        color: '#333',                               // Dark axis labels
        fontSize: 16
      }
    },
    grid: {
      left: 70,
      right: 70,
      bottom: 50,
      top: 80
    },
    series: [
      {
        // Filled portion representing the selected timeframe
        type: 'pictorialBar',
        symbol: pictorialIcon,
        symbolRepeat: 'fixed',
        symbolMargin: '5%',
        symbolClip: true,
        symbolSize: 40,
        symbolBoundingData: lifetimeEnergy,
        data: [periodEnergy],
        z: 10
      },
      {
        // Background icons representing lifetime total
        type: 'pictorialBar',
        symbol: pictorialIcon,
        itemStyle: { opacity: 0.2 },
        animationDuration: 0,
        symbolRepeat: 'fixed',
        symbolMargin: '5%',
        symbolSize: 40,
        symbolBoundingData: lifetimeEnergy,
        data: [lifetimeEnergy],
        z: 5,
        label: {
          show: true,
          position: 'right',
          offset: [10, 0],
          color: '#333',        // Dark label for percentage
          fontSize: 18,
          formatter: () => {
            const percent = (periodEnergy / lifetimeEnergy) * 100;
            return `${percent.toFixed(1)} %`;
          }
        }
      }
    ]
  };

  // If the chart is already initialized, just update the option.
  if (chart) {
    chart.setOption(option);
  } else if (chartContainer.value) {
    chart = echarts.init(chartContainer.value);
    chart.setOption(option);
  }
}

function handleResize() {
  if (chart && chart.getDom()) {
    chart.resize();
  }
}

onMounted(async () => {
  isMounted = true;
  await fetchData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  isMounted = false;
  window.removeEventListener('resize', handleResize);
  if (chart) {
    chart.dispose();
  }
});

const props = defineProps({
    chartData: {
        type: Object,
        required: true
    },
    chartOptions: {
        type: Object,
        required: true
    }
});
</script>

<style scoped>
/* Update the chart-wrapper styling */
.chart-wrapper {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controls {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.period-label {
  font: 400 14px Inter, sans-serif;
  color: #333;
}

.period-select {
  background-color: transparent;
  color: #333;
  font: 400 14px Inter, sans-serif;
  border: 1px solid #333;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  appearance: none;
}

.period-select:hover {
  background-color: #f1f1f1;
}

.chart-container {
  width: 100%;
  height: calc(100% - 60px); /* Adjust for controls height */
  position: relative;
  background: #ffffff;
}

.loading, .error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2em;
  color: #666;
}

.error {
  color: #dc3545;
}
</style>
