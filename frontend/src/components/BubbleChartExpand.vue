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

    <!-- 1 · Data Sources -->
    <div class="accordion">
      <details>
        <summary>Data Sources</summary>
        <div class="accordion-content">
          <p>
            Every dot comes from the campus fuel‑cell telemetry system. Two values are logged
            once a day at midnight:
          </p>
          <ul>
            <li><strong>Gas Flow (therms)</strong> – the volume of natural gas consumed in the last 24 h.</li>
            <li><strong>Electricity Out (kWh)</strong> – the electrical energy delivered in the same 24 h.</li>
          </ul>
          <p>
            A therm is a standard heat unit (≈29.3 kWh of chemical energy). Comparing it with
            the electricity produced lets facilities staff track how well the fuel cell converts
            fuel into useful power.
          </p>
        </div>
      </details>
    </div>

    <!-- 2 · Chart Overview & How to Read It -->
    <div class="accordion">
      <details>
        <summary>What the Chart Shows & How to Read It</summary>
        <div class="accordion-content">
          <p>
            Each blue dot is <strong>one day</strong> of fuel‑cell operation. Gas use (therms) is on
            the&nbsp;X‑axis, electricity produced (kWh) on the&nbsp;Y‑axis.  
          </p>

          <ul>
            <li>
              <strong>Dot position</strong> – The farther right, the more gas was consumed;
              the higher up, the more electricity was produced.
              A dot in the upper right corner means the fuel cell is running well.
            </li>
            <li>
              <strong>Cluster shape</strong> – A tight, oval‑shaped cloud signals steady performance;
              scattered points suggest weather swings, maintenance events, or changes in campus load.
            </li>
            <li>
              <strong>Outliers</strong> – A dot far <em>below</em> the dashed trendline marks a low‑efficiency day;
              a dot well <em>above</em> highlights an exceptionally efficient day.
            </li>
            <li>
              <strong>Overall drift</strong> – If the whole cloud creeps upward‑left over weeks, efficiency
              is improving. Sliding downward‑right indicates it’s time for inspection or tune‑up.
            </li>
          </ul>

          <p>
            In short, the position, spread, and movement of the dots turn raw daily logs into an
            at‑a‑glance health report for the fuel cell.
          </p>
        </div>
      </details>
    </div>


    <!-- 3 · Axes & Trendline -->
    <div class="accordion">
      <details>
        <summary>Axes & Trendline</summary>
        <div class="accordion-content">
          <ul>
            <li><strong>X‑Axis</strong> – Daily natural‑gas input in therms.</li>
            <li><strong>Y‑Axis</strong> – Daily electricity output in kilowatt‑hours.</li>
            <li>
              <strong>Trendline</strong> – A dashed “best‑fit” line through all the dots.
              Its <em>slope</em> is the average conversion rate:
              <strong>Efficiency = kWh ÷ therms</strong>.  The full equation appears just above
              the chart so anyone can do a quick manual check.
            </li>
          </ul>
          <p>
            A steeper slope (more “rise” per unit of “run”) means the plant
            is getting more electricity from every therm of gas.
          </p>
        </div>
      </details>
    </div>

    <!-- 4 · Hover Tool‑Tip -->
    <div class="accordion">
      <details>
        <summary>Hover Tool‑Tip</summary>
        <div class="accordion-content">
          <p>Mouse‑over any dot to see a quick read‑out:</p>
          <ul>
            <li><strong>Date</strong> the reading was taken</li>
            <li><strong>Gas input</strong> (therms)</li>
            <li><strong>Electricity output</strong> (kWh)</li>
            <li><strong>Efficiency</strong> = kWh ÷ therms for that specific day</li>
          </ul>
          <p>
            Use the tooltip to gauge whether a particular day sits above or below
            the long‑term average.
          </p>
        </div>
      </details>
    </div>

    <!-- 5 · More Info -->
    <div class="accordion">
      <details>
        <summary>More Info</summary>
        <div class="accordion-content">
          <ul>
            <!-- <li>
              The fuel cell’s design target is about <strong>50 % electric efficiency</strong>;
              real‑world results vary with outside temperature and campus demand.
            </li> -->
            <li>
              One therm ≈ <strong>29.3 kWh</strong> of chemical energy.  
              The best days on the chart convert >15 kWh of that into electricity —
              the rest leaves as useful heat for hot‑water loops.
            </li>
            <li>
              Tracking daily efficiency helps planners spot fouled filters,
              catalyst ageing, or control issues long before alarms go off.
            </li>
            <li>
              Higher efficiency means fewer therms burned and lower carbon emissions
              for every kilowatt‑hour the campus consumes.
            </li>
          </ul>
        </div>
      </details>
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
/* ---------- page + wrapper ---------- */
html,
body {
  height: 100%;
  margin: 0;
  background: #ffffff;
}

.chart-wrapper {
  padding: 20px;
  background: #f9f9f9;              /* same card look as bar‑chart page */
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  min-height: 100vh;                /* fill viewport; enables inner scroll */
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;             /* 👈 stretch children to full width */
}

/* ---------- chart area -------------- */
.chart-container {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

/* ---------- close button ------------ */
.close-button {
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
.close-button:hover { background-color: #FF2C2C; }

/* ---------- trendline text ---------- */
.trend-equation {
  margin: 12px 0;
  font-size: 16px;
  text-align: center;
  color: #000;
}

/* ---------- accordions -------------- */
.accordion {
  width: 100%;                      /* full width like the bar‑chart page */
  margin-top: 20px;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  color: #003b70;
}

.accordion-content {
  margin-top: 10px;
  padding-left: 10px;
  background-color: #ffffff;
}

.accordion-content strong { font-weight: 700; }
</style>

