<template>
  <div class="chart-with-details">
    <!-- Close Button -->
    <button class="close-btn" @click="navigateBack">X</button>

    <!-- Period selector -->
    <div class="controls" @click.stop>
      <label for="periodSelect" class="period-label">Select Timeframe:</label>
      <select
        id="periodSelect"
        v-model="selectedPeriod"
        @change="fetchData"
        class="period-select"
      >
        <option value="1 month">1 Month</option>
        <option value="6 months">6 Months</option>
        <option value="1 year">1 Year</option>
        <option value="2 years">2 Years</option>
        <option value="5 years">5 Years</option>
        <option value="lifetime">Lifetime</option>
      </select>
    </div>

    <!-- Chart container -->
    <div ref="chartContainer" class="chart-container">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>

    <!-- Data sources and other details (accordion sections) -->
    <div class="accordion" v-for="(text, index) in accordionData" :key="index">
      <details>
        <summary>{{ text.summary }}</summary>
        <div class="accordion-content">
          <p v-if="text.content">{{ text.content }}</p>
          <ul v-if="text.list">
            <li v-for="(item, idx) in text.list" :key="idx">
              <strong>{{ item.title }}</strong> - {{ item.description }}
            </li>
          </ul>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import * as echarts from 'echarts';
import axios from 'axios';
import outputIcon from '@/assets/output-onlinepngtools.png';

const pictorialIcon = 'image://' + outputIcon;
const chartContainer = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedPeriod = ref('1 year');
let chart = null;
let lifetimeEnergy = 0;
let periodEnergy = 0;

const accordionData = [
  {
    summary: 'Data Sources',
    list: [
      { title: 'Fuel-cell log', description: 'One kWh total at the end of each day.' },
      { title: 'Solar-panel log', description: 'kWh from every array, saved once an hour.' }
    ]
  },
  {
    summary: 'What the Chart Shows & How to Read It',
    content: 'The line of leaf icons is like a battery gauge: pale leaves mark 100% of lifetime renewable energy, while bright leaves fill up to show the share made in the period you selected.'
  },
  {
    summary: 'Axes & Icons',
    content: 'The X-axis runs from 0 kWh to the lifetime total. The Y-axis represents one bar labelled "Campus". Each leaf stands for the same amount of energy.'
  },
  {
    summary: 'Why It Matters',
    list: [
      { title: '', description: 'The "1 Year" view shows if we are on track with climate goals.' },
      { title: '', description: 'More bright leaves year-on-year means our renewable program is expanding.' }
    ]
  }
];

async function fetchData() {
  try {
    loading.value = true;
    error.value = null;
    const { data } = await axios.get(
      `http://localhost:3000/api/tables/gettreedata?period=${encodeURIComponent(selectedPeriod.value)}`
    );
    const row = data[0] || {};
    lifetimeEnergy = Number(row.lifetime_energy);
    periodEnergy = Number(row.period_energy);
    updateChart();
  } catch (e) {
    console.error('Error fetching energy data:', e);
    error.value = e.message || 'Failed to load energy data';
  } finally {
    loading.value = false;
  }
}

function updateChart() {
  if (!chartContainer.value || lifetimeEnergy === 0) return;

  const formatNumber = num => Math.round(num).toLocaleString('en-US');
  const option = {
    title: {
      text: 'Campus Renewable Energy Output',
      subtext: `Lifetime: ${formatNumber(lifetimeEnergy)} kWh | ${selectedPeriod.value}: ${formatNumber(periodEnergy)} kWh`,
      left: 'center',
      textStyle: { color: '#333', fontSize: 24 },
      subtextStyle: { color: '#444', fontSize: 16, lineHeight: 24 }
    },
    tooltip: {
      trigger: 'axis',
      textStyle: { color: '#333' },
      formatter: params => {
        const value = Math.round(params[0].data);
        return `${params[0].name}: ${value.toLocaleString('en-US')} kWh`;
      }
    },
    backgroundColor: '#fff',
    xAxis: {
      max: lifetimeEnergy,
      splitLine: { show: false },
      axisLine: { lineStyle: { color: '#333' } },
      axisLabel: {
        color: '#333',
        margin: 10,
        rotate: window.innerWidth < 600 ? 45 : 0,  // Rotate labels on smaller screens
        fontSize: window.innerWidth < 600 ? 10 : 14  // Adjust font size on smaller screens
      }
    },
    yAxis: {
      data: ['Campus'],
      inverse: true,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { color: '#333', fontSize: 16, margin: 10 }
    },
    grid: { left: 100, right: 100, top: 80, bottom: 50 },
    series: [
      {
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
          offset: [15, 0],
          color: '#333',
          fontSize: 18,
          formatter: () => `${Math.round((periodEnergy / lifetimeEnergy) * 100)} %`
        }
      }
    ]
  };

  if (chart) {
    chart.setOption(option);
  } else {
    chart = echarts.init(chartContainer.value);
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
  }
}

onMounted(async () => {
  await nextTick();
  window.addEventListener('resize', () => chart.resize());
  fetchData();
});

onUnmounted(() => {
  window.removeEventListener('resize', () => chart.resize());
  if (chart) {
    chart.dispose();
    chart = null;
  }
});

const router = useRouter();
const navigateBack = () => {
  router.push("/");
};
</script>

<style scoped>
.chart-with-details {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  height: 100vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}

.chart-container {
  width: 100%;
  flex: 1;
  position: relative;
  background: #fff;
}

.loading, .error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2em;
}
.error { color: #dc3545; }

.accordion {
  width: 100%;
  margin-top: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  color: #003b70;
}

.accordion-content {
  margin-top: 10px;
  padding-left: 10px;
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
}

.close-btn:hover {
  background-color: #FF2C2C;
}
</style>
