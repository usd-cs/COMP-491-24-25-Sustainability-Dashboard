<template>
  <div>
    <h2>Energy Sources Distribution</h2>
    <v-chart class="chart" :option="chartOptions" />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { use } from 'echarts/core';
import VChart from 'vue-echarts';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import Papa from 'papaparse';

use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

export default defineComponent({
  components: {
    VChart
  },
  setup() {
    const chartOptions = ref({});

    const loadCSVData = async () => {
      const response = await fetch('/mnt/data/sources-of-electricity (1).csv');
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data.map(row => ({
            name: row['Category'],
            value: parseFloat(row['MWh'])
          }));

          chartOptions.value = {
            title: {
              text: 'Energy Sources Distribution',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: 'Energy Sources',
                type: 'pie',
                radius: '50%',
                data
              }
            ]
          };
        }
      });
    };

    onMounted(loadCSVData);

    return { chartOptions };
  }
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>
