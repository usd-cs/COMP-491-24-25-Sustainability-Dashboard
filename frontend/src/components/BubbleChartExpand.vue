<template>
  <div class="chart-wrapper">
    <!-- Close (X) Button -->
    <button @click="navigateBack" class="close-button">X</button>

    <!-- Scatter + Trendline Chart -->
    <div ref="chart" class="chart-container"></div>

    <!-- Display Trendline Equation -->
    <div v-if="trendEquation" class="trend-equation">
      <strong>Trendline Equation:</strong> {{ trendEquation }}
    </div>

    <!-- Accordion Below Chart -->
    <div class="accordion">
      <button class="accordion-toggle" @click="isExpanded = !isExpanded">
        {{ isExpanded ? 'Hide Info' : 'Show Info' }}
      </button>
      <div v-if="isExpanded" class="accordion-content">
        <p>This chart visualizes daily fuel-cell efficiency.</p>
        <ul>
          <li>X-Axis: Gas Flow (therms)</li>
          <li>Y-Axis: Electricity Output (kWh)</li>
          <li>Trendline: Average kWh per therm conversion rate</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import { nextTick } from 'vue';

export default {
  name: 'BubbleChartExpand',
  data() {
    return {
      chartData: [],
      isExpanded: false,
      trendEquation: ''
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
        const { data } = await axios.get('http://localhost:3000/api/tables/getbubblechart');
        this.chartData = data.map(r => ({
          date: r.date_local,
          gas: +r.gas_flow_in_therms,
          output: +r.electricity_out_kwh
        }));
        await nextTick();
        this.renderChart();
      } catch (e) {
        console.error(e);
        this.chartData = [];
      }
    },
    renderChart() {
      if (!this.chartData.length) return;

      const dates     = this.chartData.map(r => r.date);
      const gasInputs = this.chartData.map(r => r.gas);
      const outputs   = this.chartData.map(r => r.output);

      // compute linear regression
      const n     = gasInputs.length;
      const meanX = gasInputs.reduce((a,b) => a + b, 0) / n;
      const meanY = outputs.reduce((a,b) => a + b, 0) / n;
      let num = 0, den = 0;
      for (let i = 0; i < n; i++) {
        num += (gasInputs[i] - meanX) * (outputs[i] - meanY);
        den += (gasInputs[i] - meanX) ** 2;
      }
      const slope     = den === 0 ? 0 : num / den;
      const intercept = meanY - slope * meanX;
      this.trendEquation = `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;

      const trendline = gasInputs.map(x => [x, slope * x + intercept]);

      const chart = echarts.init(this.$refs.chart);
      chart.setOption({
        title: { text: 'Fuel Cell Efficiency Analysis', left: 'center' },
        tooltip: {
          trigger: 'item',
          formatter: params => {
            if (params.seriesName === 'Trendline') {
              return `Trendline: ${this.trendEquation}`;
            }
            const i = params.dataIndex;
            const d = new Date(dates[i]);
            const date = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
            const gas = gasInputs[i].toFixed(2);
            const out = outputs[i].toFixed(2);
            const eff = (outputs[i] / gasInputs[i]).toFixed(2);
            return [
              `Date: ${date}`,
              `Gas: ${gas} therms`,
              `Output: ${out} kWh`,
              `Efficiency: ${eff} kWh/therm`
            ].join('<br/>');
          }
        },
        xAxis: { type: 'value', name: 'Gas Flow (therms)' },
        yAxis: {
          type: 'value',
          name: 'Electricity Out (kWh)',
          min: 0
        },
        series: [
          {
            name: 'Daily Output vs Fuel Input',
            type: 'scatter',
            data: gasInputs.map((x,i) => [x, outputs[i]]),
            symbolSize: 10,
            itemStyle: { opacity: 0.8 }
          },
          {
            name: 'Trendline',
            type: 'line',
            data: trendline,
            smooth: true,
            lineStyle: { width: 2, type: 'dashed' },
            showSymbol: false
          }
        ]
      });
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
  position: relative;
  width: 100%;
  height: 100%;
  padding: 8px;
  background: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  z-index: 0;
}

.trend-equation {
  margin: 12px 0;
  font-size: 16px;
  text-align: center;
  color: #000;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background-color: #FF6B6B;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
}
.close-button:hover {
  background-color: #FF2C2C;
}

/* Accordion Styles */
.accordion {
  margin-top: 16px;
  width: 100%;
  max-width: 800px;
}

.accordion-toggle {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.accordion-content {
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-top: 8px;
  color: #000;
}

.accordion-content p,
.accordion-content li {
  color: #000;
}
</style>
