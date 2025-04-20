<template>
  <div class="chart-with-details">
    <button class="close-btn" @click="handleBackClick">
      {{ isDrilldown ? '←' : 'X' }}
    </button>
    <div ref="chart" class="chart-container"></div>

    <div class="accordion">
      <details>
        <summary>About Energy Production Data</summary>
        <div class="accordion-content">
          <p>{{ isDrilldown ? 'Daily' : 'Weekly' }} energy production from:</p>
          <ul>
            <li><strong>Fuel Cell:</strong> Energy generated from our campus fuel cell system</li>
            <li><strong>Solar Panels:</strong> Energy harvested from campus solar installations</li>
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
  },
  methods: {
    async fetchChartData() {
      try {
        const response = await axios.get('http://localhost:3000/api/tables/getcombinedweekly');
        // Sort data chronologically and get last 4 weeks
        const data = response.data
          .sort((a, b) => new Date(b.week_start) - new Date(a.week_start))
          .slice(0, 4)
          .reverse();

        // Transform the data into required arrays with formatted dates
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
      
      this.chartInstance = echarts.init(this.$refs.chart);
      const options = {
        title: {
          text: this.title,
          left: 'center',
          top: '5%'
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
            rotate: 45,
            formatter: (value) => {
              return value.split(',')[0]; // Show just MM/DD - MM/DD
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'Energy (kWh)',
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
      
      // Add click handler for drilldown
      this.chartInstance.on('click', (params) => {
        console.log('Click event triggered:', params);
        const weekStart = this.weekDates[params.dataIndex];
        const source = params.seriesName;
        
        this.isDrilldown = true;
        this.selectedWeek = weekStart;
        this.selectedSource = source;
        
        // Force chart disposal and re-creation for drilldown
        if (this.chartInstance) {
          this.chartInstance.dispose();
          this.chartInstance = null;
        }
        
        this.renderDrilldown(weekStart, source);
      });
    },

    async renderDrilldown(weekStart, source) {
      try {
        console.log('Rendering drilldown for:', { weekStart, source });
        
        const response = await axios.get(`http://localhost:3000/api/tables/getcombinedweekly/daily`, {
          params: { weekStart }
        });

        console.log('API Response:', {
          status: response.status,
          headers: response.headers,
          data: response.data
        });

        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          console.error('Invalid or empty data received');
          return;
        }

        // Sort data by day number
        const sortedData = [...response.data].sort((a, b) => 
          (parseInt(a.day_number) || 0) - (parseInt(b.day_number) || 0)
        );

        console.log('Sorted daily data:', sortedData);

        // Create new chart instance for drilldown view
        if (this.chartInstance) {
          this.chartInstance.dispose();
          this.chartInstance = null;
        }

        this.chartInstance = echarts.init(this.$refs.chart);

        const dataValues = sortedData.map(d => {
          const value = source === 'Fuel Cell' ? d.fuelcell_kwh : d.solar_kwh;
          console.log(`Processing ${d.day_name}: ${value}`);
          return Number(value || 0).toFixed(2);
        });

        console.log('Processed data values:', dataValues);

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
            formatter: (params) => `${params[0].name}: ${Number(params[0].value).toLocaleString()} kWh`
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
        
        console.log('Setting chart options:', drilldownOptions);
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
      this.$router.push('/main');
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

.chart-with-details {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  height: 100%;
  position: relative;
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
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: #FF6B6B;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: #FF2C2C;
}
</style>
