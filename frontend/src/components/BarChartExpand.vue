<template>
  <div class="chart-with-details">
    <button class="close-btn" @click="handleBackClick">
      {{ isDrilldown ? '←' : 'X' }}
    </button>
    <div ref="chart" class="chart-container"></div>

    <!-- 1. Data Sources -->
    <div class="accordion">
      <details>
        <summary>Data Sources</summary>
        <div class="accordion-content">
          <p>Numbers come from two live campus systems:</p>
          <ul>
            <li>
              <strong>Fuel Cell</strong> - A high-efficiency unit that turns natural gas
              into electricity <em>and</em> useful heat.  One total is logged for each
              24-hour period.
            </li>
            <li>
              <strong>Solar Panels</strong> - Eleven rooftop and parking-lot arrays that
              generate power whenever the sun shines.  Output is metered hourly, then
              rolled up into daily and weekly sums.
            </li>
          </ul>
          <p>
            Together, these two sources supply the campus's renewable electricity.
          </p>
        </div>
      </details>
    </div>

    <!-- 2. Chart Overview -->
    <div class="accordion">
      <details>
        <summary>What This Chart Shows</summary>
        <div class="accordion-content">
          <p>
            The chart presents a <strong>{{ isDrilldown ? 'daily' : 'weekly' }}</strong>
            total of electricity produced, measured in kilowatt-hours (kWh).
            <i>Reference: Running a typical laptop for ten hours uses roughly 0.5 kWh.</i>
          </p>
          <ul>
            <li><strong>Green bars</strong> = Fuel Cell production for the period.</li>
            <li><strong>Gold bars</strong> = Solar Panel production for the same period.</li>
          </ul>
          <p>
            Comparing the two colors highlights how steady fuel-cell output
            complements the sun-powered contribution from solar panels.
          </p>
        </div>
      </details>
    </div>

    <!-- 3. Understanding Each Bar -->
    <div class="accordion">
      <details>
        <summary>Reading a Bar</summary>
        <div class="accordion-content">
          <ul>
            <li><strong>Height</strong> - taller bars indicate more kWh produced.</li>
            <li><strong>Value on top</strong> - exact kWh, rounded for quick reading.</li>
            <li><strong>Tool Tip</strong> - selecting a bar switches to a day-by-day view for that specific source and week.</li>
          </ul>
          <p>
            Grouped bars make it easy to spot the leading source each week and to track
            changes in the energy mix over time.
          </p>
        </div>
      </details>
    </div>

    <!-- 4. Drill‑Down Mode -->
    <div class="accordion">
      <details>
        <summary>Drill-Down Mode</summary>
        <div class="accordion-content">
          <p>Click any bar to zoom in:</p>
          <ul>
            <li>The X-axis switches to <strong>Mon-Sun</strong> for that week.</li>
            <li>Only the chosen source (fuel cell <em>or</em> solar) appears, making daily patterns clearer.</li>
            <li>
              Mid-week peaks and weekend dips often reflect weather, maintenance, or campus demand.
            </li>
            <li>Select the “←” button (upper-right) to return to the four-week overview.</li>
          </ul>
        </div>
      </details>
    </div>

    <!-- 5. More Info -->
    <div class="accordion">
      <details>
        <summary>More Info</summary>
        <div class="accordion-content">
          <ul>
            <li>
              The fuel cell operates 24/7, providing a stable “base load” even after sunset or during cloudy hours.
            </li>
            <li>
              Weekly totals help facilities staff quickly identify issues—sudden drops can signal maintenance needs.
            </li>
            <li>
              Every kWh from the fuel cell and solar panels replaces grid electricity, lowering campus carbon emissions.
            </li>
          </ul>
        </div>
      </details>
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'BarChartWithAccordion',
  data() {
    return {
      chartInstance: null,
      categories: [],
      weekDates: [],
      fuelCell: [],
      solarPanels: [],
      title: 'Last 4 Weeks Energy Production',
      isDrilldown: false,
      selectedWeek: null,
      selectedSource: null
    };
  },
  mounted() {
    this.fetchChartData();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
  },
  methods: {
    async fetchChartData() {
      try {
        const response = await axios.get('http://localhost:3000/api/tables/getcombinedweekly');
        const data = response.data
          .sort((a, b) => new Date(b.week_start) - new Date(a.week_start))
          .slice(0, 4)
          .reverse();

        this.categories = data.map(r => {
          const date = new Date(r.week_start);
          const endDate = new Date(date);
          endDate.setDate(date.getDate() + 6);
          return `${date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit'
          })} - ${endDate.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit'
          })}`;
        });
        
        this.weekDates = data.map(r => r.week_start);
        this.fuelCell = data.map(r => Number(r.total_fuelcell_kwh).toFixed(2));
        this.solarPanels = data.map(r => Number(r.total_solar_kwh).toFixed(2));

        this.renderChart();
      } catch (error) {
        console.error('Error fetching weekly energy data:', error);
      }
    },

    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.dispose();
        this.chartInstance = null;
      }

      // markRaw to prevent Vue from proxying ECharts internals
      this.chartInstance = markRaw(echarts.init(this.$refs.chart));

      const options = {
        title: {
          text: this.title,
          left: 'center',
          top: '0%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params) => {
            let result = `${params[0].name}<br/>`;
            params.forEach(param => {
              result += `${param.seriesName}: ${param.value} kWh<br/>`;
            });
            return result;
          }
        },
        legend: {
          data: ['Fuel Cell', 'Solar Panels'],
          top: 30
        },
        grid: {
          top: 80,
          left: 30,
          right: 30,
          bottom: 40,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.categories,
          axisLabel: {
            rotate: 0,
            formatter: (value) => {
              return value.split(',')[0];
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'Energy (kWh)',
          max: (value) => {
            const interval = 30000;
            return Math.ceil(value.max / interval) * interval + interval;
          },
          axisLabel: {
            formatter: (value) => `${value.toLocaleString()} kWh`
          }
        },
        series: [
          {
            name: 'Fuel Cell',
            type: 'bar',
            data: this.fuelCell,
            itemStyle: { color: '#91CC75' },
            label: {
              show: true,
              position: 'top',
              formatter: (params) => `${Number(params.value).toLocaleString()}`
            }
          },
          {
            name: 'Solar Panels',
            type: 'bar',
            data: this.solarPanels,
            itemStyle: { color: '#FAC858' },
            label: {
              show: true,
              position: 'top',
              formatter: (params) => `${Number(params.value).toLocaleString()}`
            }
          }
        ]
      };

      this.chartInstance.setOption(options);

      this.chartInstance.on('click', (params) => {
        const weekStart = this.weekDates[params.dataIndex];
        const source = params.seriesName;

        this.isDrilldown = true;
        this.selectedWeek = weekStart;
        this.selectedSource = source;

        if (this.chartInstance) {
          this.chartInstance.dispose();
          this.chartInstance = null;
        }

        this.renderDrilldown(weekStart, source);
      });
    },

    async renderDrilldown(weekStart, source) {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/tables/getcombinedweekly/daily',
          { params: { weekStart } }
        );

        const sortedData = [...response.data].sort((a, b) =>
          (parseInt(a.day_number) || 0) - (parseInt(b.day_number) || 0)
        );

        if (this.chartInstance) {
          this.chartInstance.dispose();
          this.chartInstance = null;
        }

        this.chartInstance = markRaw(echarts.init(this.$refs.chart));

        const dataValues = sortedData.map(d =>
          Number(source === 'Fuel Cell' ? d.fuelcell_kwh : d.solar_kwh || 0).toFixed(2)
        );

        const startDate = new Date(weekStart);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        const drilldownOptions = {
          title: {
            text: `${source} Daily Production (${startDate.toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit'
            })} - ${endDate.toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit'
            })})`,
            left: 'center',
            top: '5%'
          },
          tooltip: {
            trigger: 'axis',
            formatter: (params) =>
              `${params[0].name}: ${Number(params[0].value).toLocaleString()} kWh`
          },
          grid: {
            top: 80,
            left: 50,
            right: 30,
            bottom: 40,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: sortedData.map(d => d.day_name),
            axisLabel: { rotate: 0 }
          },
          yAxis: {
            type: 'value',
            name: 'Energy (kWh)',
            axisLabel: {
              formatter: (value) => `${value.toLocaleString()} kWh`
            }
          },
          series: [{
            name: source,
            type: 'bar',
            data: dataValues,
            itemStyle: {
              color: source === 'Fuel Cell' ? '#91CC75' : '#FAC858'
            },
            label: {
              show: true,
              position: 'top',
              formatter: (params) => Number(params.value).toLocaleString()
            }
          }]
        };

        this.chartInstance.setOption(drilldownOptions);
      } catch (error) {
        console.error('Error rendering drilldown:', error);
        if (error.response) {
          console.error('API Error:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          });
        }
      }
    },

    handleBackClick() {
      if (this.isDrilldown) {
        this.isDrilldown = false;
        this.selectedWeek = null;
        this.selectedSource = null;
        if (this.chartInstance) {
          this.chartInstance.dispose();
          this.chartInstance = null;
        }
        this.fetchChartData();
      } else {
        this.navigateBack();
      }
    },

    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    },

    navigateBack() {
      this.$router.push('/');
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

html, body {
  background: #ffffff;     /* global page background */
}

.chart-with-details {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  height: 100%;
  position: relative;
  min-height: 100vh;       /* full viewport height */
  overflow-y: auto;        /* enable scrolling within the white area */
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
  pointer-events: auto; 
}

.close-btn:hover {
  background-color: #FF2C2C;
}

.accordion-content strong {
  font-weight: 700;   /* or 600 if you prefer slightly lighter */
}
</style>
