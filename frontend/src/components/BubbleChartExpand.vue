<template>
    <div class="chart-wrapper">
      <!-- Close (X) Button -->
      <button @click="navigateBack" class="close-button">X</button>
  
      <!-- Bubble Chart -->
      <div ref="chart" class="chart-container"></div>
  
      <!-- Accordion Below Chart -->
      <div class="accordion">
        <button class="accordion-toggle" @click="isExpanded = !isExpanded">
          {{ isExpanded ? 'Hide Info' : 'Show Info' }}
        </button>
        <div v-if="isExpanded" class="accordion-content">
          <p>This chart visualizes NOx and CO₂ reductions with bubble size representing electricity output.</p>
          <ul>
            <li>X-Axis: NOx Reduction (lbs)</li>
            <li>Y-Axis: CO₂ Reduction (lbs)</li>
            <li>Bubble Size: Electricity Output (kWh)</li>
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
          const response = await axios.get('http://localhost:3000/api/tables/getbubblechart');
          const data = response.data;
          this.chartData = data.map(item => [
            parseFloat(item.nox_reduction_lbs).toFixed(3),
            parseFloat(item.co2_reduction_lbs).toFixed(3),
            parseFloat(item.electricity_out_kwh).toFixed(3)
          ]);
          nextTick(() => {
            this.renderChart();
          });
        } catch (error) {
          console.error('Error fetching chart data:', error);
          this.chartData = [];
        }
      },
      renderChart() {
        this.chartInstance = echarts.init(this.$refs.chart);
        const options = {
          title: {
            text: 'Emissions Reduction Analysis',
            left: 'center',
            top: '5%'
          },
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              return `NOx Reduction: ${params.value[0]} lbs<br/>
                      CO₂ Reduction: ${params.value[1]} lbs<br/>
                      Electricity Output: ${params.value[2]} kWh`;
            }
          },
          xAxis: {
            type: 'value',
            name: 'NOx Reduction (lbs)',
            nameLocation: 'middle',
            nameGap: 30
          },
          yAxis: {
            type: 'value',
            name: 'CO₂ Reduction (lbs)'
          },
          visualMap: {
            show: true,
            min: Math.min(...this.chartData.map(item => item[2])),
            max: Math.max(...this.chartData.map(item => item[2])),
            dimension: 2,
            inRange: {
              color: ['#d94e5d', '#eac736', '#50a3ba']
            },
            text: ['High Output', 'Low Output'],
            calculable: true,
            precision: 3,
            right: 'right',
            top: 'middle',
            padding: [0, 10, 0, 0],
            itemWidth: 20,
            itemHeight: 200,
            textStyle: { fontSize: 12 }
          },
          series: [
            {
              name: 'Reductions',
              type: 'scatter',
              data: this.chartData,
              symbolSize: function (data) {
                return Math.sqrt(data[2]) / 10;
              },
              itemStyle: { opacity: 0.8 }
            }
          ]
        };
        this.chartInstance.setOption(options);
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
  }
  </style>
  