<template>
  <div class="chart-wrapper">
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import { nextTick } from 'vue';

export default {
  name: 'BubbleChart',
  props: {
    fullPage: { type: Boolean, default: false }
  },
  data() {
    return {
      chartData: [],
      title: 'Fuel Cell Efficiency Analysis'
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

      // linear regression
      const n     = gasInputs.length;
      const meanX = gasInputs.reduce((a,b) => a+b,0)/n;
      const meanY = outputs.reduce((a,b) => a+b,0)/n;
      let num=0, den=0;
      for (let i=0; i<n; i++) {
        num += (gasInputs[i]-meanX)*(outputs[i]-meanY);
        den += (gasInputs[i]-meanX)**2;
      }
      const slope = den===0?0:num/den;
      const intercept = meanY - slope*meanX;
      const trendline = gasInputs.map(x => [x, slope*x + intercept]);

      const chart = echarts.init(this.$refs.chart);
      chart.setOption({
        title: { text: this.title, left: 'center', top: '0%' },
        tooltip: {
          trigger: 'item',
          formatter: params => {
            if (params.seriesName === 'Trendline') {
              return `Trendline: y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;
            }
            const i = params.dataIndex;
            const d = new Date(dates[i]);
            const date = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
            const gas = gasInputs[i].toFixed(2);
            const out = outputs[i].toFixed(2);
            const eff = (outputs[i]/gasInputs[i]).toFixed(2);
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
      if (this.chartInstance) this.chartInstance.resize();
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
  background: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
}
.chart-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}
</style>
