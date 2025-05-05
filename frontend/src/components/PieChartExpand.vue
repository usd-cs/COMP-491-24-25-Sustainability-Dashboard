<template>
  <div class="chart-with-details">
    <!-- Close Button -->
    <button class="close-btn" @click="navigateBack">X</button>

    <!-- Chart Section -->
    <div ref="chart" class="chart-container"></div>

    <!-- Accordion Sections -->
    <div class="accordion">
      <details>
        <summary>Data Sources</summary>
        <div class="accordion-content">
          <p>
            The chart combines live production from <strong>11 on-site solar arrays</strong>
            (rooftops and parking canopies). It tracks each inverter's hourly kWh and then
            sums those readings for the period you're viewing.
          </p>
          <ul>
            <li>Kilowatt-hour (kWh) = energy that powers a 100-W bulb for 10 hours.</li>
          </ul>
          <div class="panel-info">
            <h4>Solar Panel Distribution:</h4>
            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Number of Panels</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Alcala Borrego</td><td>126</td></tr>
                <tr><td>Alcala Laguna</td><td>126</td></tr>
                <tr><td>Camino Hall</td><td>980</td></tr>
                <tr><td>Founders Hall</td><td>308</td></tr>
                <tr><td>Copley Library</td><td>266</td></tr>
                <tr><td>Jenny Craig Pavillion</td><td>910</td></tr>
                <tr><td>Kroc Center</td><td>512</td></tr>
                <tr><td>Manchester A</td><td>272</td></tr>
                <tr><td>Manchester B</td><td>272</td></tr>
                <tr><td>Soles/MHR</td><td>546</td></tr>
                <tr><td>West Parking</td><td>896</td></tr>
                <tr class="total"><td><strong>Total Panels</strong></td><td><strong>5,214</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </div>

    <!-- 2. What the Chart Shows & How to Read It -->
    <div class="accordion">
      <details>
        <summary>What the Chart Shows & How to Read It</summary>
        <div class="accordion-content">
          <p>
            The donut displays <strong>each site’s share</strong> of total solar energy for the
            selected period. A bigger slice = more kWh produced.
          </p>
          <ul>
            <li><strong>Hover</strong> any slice (or legend) to see the exact kWh and % share.</li>
            <li><strong>Legend</strong> is split left/right to fit all 11 sites. Colors match slices.</li>
            <li><strong>Emphasis</strong> - click or tap a slice to pop it out slightly and focus.</li>
          </ul>
        </div>
      </details>
    </div>

    <!-- 3. Why It Matters -->
    <div class="accordion">
      <details>
        <summary>Why It Matters</summary>
        <div class="accordion-content">
          <ul>
            <li>
              <strong>Performance targeting</strong> - Sites with small shares may need
              cleaning, shade trimming, or inverter checks.
            </li>
            <li>
              <strong>Planning upgrades</strong> - Knowing today’s leaders helps decide
              where additional panels will have the biggest impact.
            </li>
            <li>
              <strong>Risk diversification</strong> - A balanced donut means no single
              array failure can erase most of the solar supply.
            </li>
          </ul>
        </div>
      </details>
    </div>

    <!-- 4. More Info / Fun Facts -->
    <div class="accordion">
      <details>
        <summary>More Info / Fun Facts</summary>
        <div class="accordion-content">
          <ul>
            <li>
              South-facing roofs generally outperform east/west orientations by
              <strong>15-20%</strong> in annual output.
            </li>
            <li>
              Parking-lot canopies double as shade structures, cutting cabin
              temperatures by up to <strong>25 °F</strong> in summer.
            </li>
            <li>
              Combined, these arrays can offset roughly
              <strong>1,300 tons CO₂</strong> per year compared with grid power.
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

export default {
  name: 'PieChartWithAccordion',
  data() {
    return {
      chartData: [],
      title: 'Solar Energy Contributions by Site',
      chartInstance: null,
      panelData: {
        'Alcala Borrego': 126,
        'Alcala Laguna': 126,
        'Camino Hall': 980,
        'Copley Library': 266,
        'Founders Hall': 308,
        'Jenny Craig Pavilion': 910,
        'Kroc Center': 512,
        'Manchester A': 272,
        'Manchester B': 272,
        'Soles/MHR': 546,
        'West Parking': 896
      }
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
      this.$router.push('/');
    },
    async fetchChartData() {
      try {
        const { data } = await axios.get('http://localhost:3000/api/tables/energy/solar/contributions');
        this.chartData = data.map(r => ({
          name: r.site,
          value: parseFloat(r.total_kwh.toFixed(2)),
          percent: 0,
          unit: 'kWh'
        }));
        const total = this.chartData.reduce((sum, itm) => sum + itm.value, 0);
        this.chartData.forEach(itm => {
          itm.percent = ((itm.value / total) * 100).toFixed(2);
        });
        this.renderChart();
      } catch (error) {
        console.error('Error fetching solar contributions:', error);
      }
    },
    renderChart() {
      const names = this.chartData.map(i => i.name);
      const mid = Math.ceil(names.length / 2);
      const leftNames = names.slice(0, mid);
      const rightNames = names.slice(mid);

      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        color: [
          '#5470C6', '#91CC75', '#FAC858', '#EE6666',
          '#73C0DE', '#3BA272', '#FC8452', '#9A60B4',
          '#5A9BD4', '#50C878', '#E377C2', '#7F7F7F',
          '#BCBD22', '#17BECF'
        ],
        title: {
          text: this.title,
          left: 'center',
          top: '2%'
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const panelCount = this.getPanelCount(params.name);
            return `${params.name}<br/>Energy: ${params.value} kWh (${params.percent}%)<br/>Solar Panels: ${panelCount}`;
          }
        },
        legend: [
          { orient: 'vertical', left: '20%', top: '30%', data: leftNames },
          { orient: 'vertical', right: '20%', top: '30%', data: rightNames }
        ],
        series: [{
          name: 'Solar Output',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '55%'],
          avoidLabelOverlap: false,
          label: { show: false },
          labelLine: { show: false },
          emphasis: {
            label: { show: true, fontSize: 14, fontWeight: 'bold' },
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' }
          },
          data: this.chartData
        }]
      });
    },
    getPanelCount(siteName) {
      // Helper function to find panel count based on site name
      for (const [key, value] of Object.entries(this.panelData)) {
        if (siteName.includes(key) || key.includes(siteName)) {
          return value;
        }
      }
      return 'N/A';
    },
    handleResize() {
      if (this.chartInstance) this.chartInstance.resize();
    }
  }
};
</script>

<style scoped>
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

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  line-height: 36px;
  background: #FF6B6B;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
}

.chart-container {
  flex: 0 0 400px;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

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

.panel-info {
  margin-top: 20px;
}

.panel-info table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.panel-info th,
.panel-info td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.panel-info th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.panel-info .total {
  font-weight: bold;
  background-color: #f9f9f9;
}

@media (max-width: 420px) {
  .chart-with-details {
    padding: 12px;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  .chart-container {
    height: 45vh; /* Adjust chart size */
    max-height: none;
    margin-bottom: 15px; /* Add margin for accordion sections */
  }

  .accordion {
    padding: 10px;
    font-size: 15px;
  }

  .accordion-content {
    padding-left: 5px;
  }

  summary {
    font-size: 16px;
  }

  /* Adjust chart legend on mobile */
  .chart-container .echarts-legend {
    display: none; /* Hide legend on small screens */
  }

  /* Optionally, we can also tweak the tooltip behavior for smaller screens */
  .chart-container .echarts-tooltip {
    font-size: 12px;
  }

  .panel-info table {
    font-size: 14px;
  }
  
  .panel-info th,
  .panel-info td {
    padding: 6px;
  }
}
</style>
