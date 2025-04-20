<template>
  <div class="chart-wrapper">
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'BarChart',
  data() {
    return {
      chartInstance: null,
      categories: [],
      weekDates: [],
      fuelCell: [],
      solarPanels: [],
      title: 'Last 4 Weeks Energy Production'
    };
  },
  mounted() {
    this.fetchChartData();
  },
  beforeUnmount() {
    if (this.chartInstance) {
      window.removeEventListener('resize', this.resizeHandler);
    }
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
        
        // Store original dates for drilldown
        this.weekDates = data.map(r => r.week_start);
        this.fuelCell = data.map(r => Number(r.total_fuelcell_kwh).toFixed(2));
        this.solarPanels = data.map(r => Number(r.total_solar_kwh).toFixed(2));

        this.renderChart();
      } catch (error) {
        console.error('Error fetching weekly energy data:', error);
      }
    },
    
    renderChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      const options = {
        title: {
          text: this.title,
          left: 'center',
          top: 10
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
              return value.split(',')[0]; // Show just MM/DD/YYYY
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
        const weekStart = this.weekDates[params.dataIndex];
        this.$emit('drilldown', {
          seriesName: params.seriesName,
          weekStart: weekStart
        });
      });
      
      this.resizeHandler = () => this.chartInstance.resize();
      window.addEventListener('resize', this.resizeHandler);
    }
  }
};
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container {
  width: 100%;
  height: 100%;
  justify-content: center;
}
</style>