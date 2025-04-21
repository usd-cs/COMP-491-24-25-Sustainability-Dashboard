<!-- TreeChartExpand.vue  (a.k.a. pictorial “battery‑fill” chart) -->
<template>
  <div class="chart-with-details">
    <!-- ⬅ / ✖ button -->
    <button class="close-btn" @click="navigateBack">X</button>

    <!-- period selector -->
    <div class="controls" @click.stop>
      <label for="periodSelect" class="period-label">Select Timeframe:</label>
      <select
        id="periodSelect"
        v-model="selectedPeriod"
        @change="fetchData"
        @click.stop
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

    <!-- chart -->
    <div ref="chartContainer" class="chart-container">
      <div v-if="loading" class="loading">Loading…</div>
      <div v-if="error"   class="error">{{ error }}</div>
    </div>

    <!-- 1 · Data Sources -->
    <div class="accordion">
      <details>
        <summary>Data Sources</summary>
        <div class="accordion-content">
          <p>Two live logs feed the campus energy database:</p>
          <ul>
            <li><strong>Fuel-cell log</strong> - one kWh total at the end of each day.</li>
            <li><strong>Solar-panel log</strong> - kWh from every array, saved once an hour.</li>
          </ul>
          <p>
            The chart adds up all kWh data points to give the <em>lifetime</em> total and a second
            total for the time-frame you pick in the menu above.
          </p>
        </div>
      </details>
    </div>

    <!-- 2 · What the Chart Shows & How to Read It -->
    <div class="accordion">
      <details>
        <summary>What the Chart Shows & How to Read It</summary>
        <div class="accordion-content">
          <p>
            The line of leaf icons is like a battery gauge:
            <strong>pale leaves</strong> mark 100 % of lifetime renewable energy,
            while <strong>bright leaves</strong> fill up to show the share made in the
            period you selected.
          </p>
          <ul>
            <li>The subtitle above the bar lists both kWh totals.</li>
            <li>The label at the right end shows that share as a percentage.</li>
            <li>Change the menu to see how quickly the total has grown.</li>
          </ul>
        </div>
      </details>
    </div>

    <!-- 3 · Axes & Icons -->
    <div class="accordion">
      <details>
        <summary>Axes & Icons</summary>
        <div class="accordion-content">
          <ul>
            <li><strong>X-axis</strong> - runs from 0 kWh to the lifetime total.</li>
            <li><strong>Y-axis</strong> - one bar labelled “Campus”.</li>
            <li>Every leaf stands for the same amount of energy.</li>
          </ul>
          <p>Only the leaves that fit inside the period total are shown in full colour.</p>
        </div>
      </details>
    </div>

    <!-- 4 · Why It Matters -->
    <div class="accordion">
      <details>
        <summary>Why It Matters</summary>
        <div class="accordion-content">
          <ul>
            <li>The “1 Year” view shows if we are on track with climate goals.</li>
            <li>More bright leaves year-on-year means our renewable program is expanding.</li>
          </ul>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';
import outputIcon from '@/assets/output-onlinepngtools.png';

const pictorialIcon = 'image://' + outputIcon;

/* -------------- reactive state ---------------------------------------- */
const chartContainer = ref(null);
const loading        = ref(true);
const error          = ref(null);
const selectedPeriod = ref('1 year');

const lifetimeCo2    = ref('—');   // em‑dash placeholder

let chart           = null;
let lifetimeEnergy  = 0;
let periodEnergy    = 0;
let isMounted       = false;

/* -------------- fetch + build ----------------------------------------- */
async function fetchData () {
  try {
    loading.value = true;
    error.value   = null;

    const { data } = await axios.get(
      `http://localhost:3000/api/tables/gettreedata?period=${encodeURIComponent(selectedPeriod.value)}`
    );
    const row = data[0] || {};
    lifetimeEnergy = +row.lifetime_energy || 0;
    periodEnergy   = +row.period_energy   || 0;

    updateChart();
  } catch (e) {
    console.error(e);
    error.value      = e.message || 'Failed to load energy data';
    lifetimeCo2.value = '—';
  } finally {
    loading.value = false;
  }
}

function updateChart () {
  /* ------------- NEW GUARD: abort if the component is gone ------------- */
  if (!isMounted || !chartContainer.value) return;
  if (!lifetimeEnergy) return;

  // Add a format helper function
  const formatNumber = (num) => Math.round(num).toLocaleString('en-US');

  const option = {
    title: {
      text: 'Campus Renewable Energy Output',
      subtext: `Lifetime: ${formatNumber(lifetimeEnergy)} kWh | ${selectedPeriod.value}: ${formatNumber(periodEnergy)} kWh`,
      left: 'center',
      textStyle: { fontSize: 24, color: '#333' },
      subtextStyle: { fontSize: 16, color: '#444', lineHeight: 24 }
    },
    tooltip: {
      trigger: 'axis',
      textStyle: { color: '#333' },
      formatter: (params) => {
        const value = Math.round(params[0].data);
        return `${params[0].name}: ${value.toLocaleString('en-US')} kWh`;
      }
    },
    backgroundColor: '#f9f9f9',
    xAxis: {
      splitLine: { show: false },
      axisLine:  { lineStyle: { color: '#333' } },
      axisLabel: { color: '#333', margin: 10 }
    },
    yAxis: {
      data: ['Campus'],
      inverse: true,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { color: '#333', fontSize: 16, margin: 10 }
    },
    grid: { left: 100, right: 100, top: 90, bottom: 50 },
    series: [
      {
        type: 'pictorialBar',
        symbol: pictorialIcon,
        symbolRepeat: 'fixed',
        symbolMargin: '5%',
        symbolSize: 40,
        symbolClip: true,
        symbolBoundingData: lifetimeEnergy,
        data: [periodEnergy],
        z: 10
      },
      {
        type: 'pictorialBar',
        symbol: pictorialIcon,
        symbolRepeat: 'fixed',
        symbolMargin: '5%',
        symbolSize: 40,
        itemStyle: { opacity: 0.2 },
        symbolBoundingData: lifetimeEnergy,
        data: [lifetimeEnergy],
        animationDuration: 0,
        z: 5,
        label: {
          show: true,
          position: 'right',
          offset: [15, 0],
          color: '#333',
          fontSize: 18,
          formatter: () => Math.round((periodEnergy / lifetimeEnergy * 100)) + ' %'
        }
      }
    ]
  };

  if (chart) {
    chart.setOption(option);
  } else {
    chart = echarts.init(chartContainer.value);
    chart.setOption(option);
    window.addEventListener('resize', handleResize);
  }
}

/* -------------- utils -------------------------------------------------- */
function handleResize () { chart && chart.resize(); }
function navigateBack () { history.length ? history.back() : (window.location.href = '/'); }

/* -------------- life‑cycle -------------------------------------------- */
onMounted(() => {
  isMounted = true;
  fetchData();
});
onUnmounted(() => {
  isMounted = false;
  window.removeEventListener('resize', handleResize);
  chart && chart.dispose();
});
</script>

<style scoped>
/* -------- page shell ---------- */
html, body, .chart-with-details {
  height: 100%;
  margin: 0;
  background: #ffffff;
}

.chart-with-details {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  min-height: 100vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* -------- close btn ------------ */
.close-btn {
  position: absolute; top: 10px; right: 10px;
  width: 36px; height: 36px; line-height: 36px;
  background: #FF6B6B; color: #fff;
  border: none; border-radius: 50%; cursor: pointer;
  z-index: 1000;
}
.close-btn:hover { background: #FF2C2C; }

/* -------- controls ------------- */
.controls { display: flex; justify-content: center; gap: 10px; margin-bottom: 10px; }
.period-label  { font: 400 14px/1.4 Inter, sans-serif; color: #333; }
.period-select {
  font: 400 14px/1.4 Inter, sans-serif; color: #333;
  background: transparent; border: 1px solid #333;
  padding: 4px 10px; border-radius: 4px; cursor: pointer;
}
.period-select:hover { background: #f1f1f1; }

/* -------- chart area ----------- */
.chart-container {
  width: 100%; height: 420px; position: relative; border-radius: 8px;
}
.loading, .error {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.1rem; color: #666;
}
.error { color: #dc3545; }

/* -------- accordions ----------- */
.accordion {
  width: 100%; margin-top: 20px; padding: 12px;
  background: #fff; border: 1px solid #ddd; border-radius: 8px; color: #003b70;
}
.accordion-content { margin-top: 10px; padding-left: 10px; background: #fff; }
.accordion-content strong { font-weight: 700; }
</style>
