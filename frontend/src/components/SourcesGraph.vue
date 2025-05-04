<template>
  <div class="chart-wrapper">
    <button class="close-btn" @click="navigateBack">X</button>
    <div v-if="!hasData">No data available for the selected building.</div>
    <div v-else ref="chart" class="chart-container"></div>
    <!-- Add the Compare button and dropdown -->
    <div class="compare-section">
      <button v-if="!showDropdown" class="comp-btn" @click="toggleDropdown">Compare</button>
      <div v-else>
        <select v-model="selectedBuilding2" @change="toggleBuilding">
          <option disabled value="">Select a building</option>
          <option 
            v-for="building in buildings"
            :key="building.name"
            :value="building.name"
            :class="{ 'highlighted': displayedBuildings.includes(building.name) }"
          >
            {{ building.name }} <span v-if="displayedBuildings.includes(building.name)">✔</span>
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, computed, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import * as echarts from 'echarts';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const navigateBack = () => {
  router.push('/sources');
};

const buildingName = route.query.buildingName;

const chart = ref(null);
const hasData = ref(false);
const errorMessage = ref('');
const showDropdown = ref(false);
const selectedBuilding2 = ref('');
const displayedBuildings = ref([]);

const buildings = ref([
  { name: "Alcala Borrego" },
  { name: "Alcala Laguna" },
  { name: "Camino Hall" },
  { name: "Copley Library" },
  { name: "Founders Hall" },
  { name: "Jenny Craig Pavilion" },
  { name: "Kroc" },
  { name: "Manchester A" },
  { name: "Manchester B" },
  { name: "Soles/MRH" },
  { name: "West Parking" }
]);

const formatBuildingName = (name) =>
  name.toLowerCase().replace(/\s+/g, "_");

const originalBuildingDisplayName = computed(() => {
  const found = buildings.value.find(
    b => formatBuildingName(b.name) === buildingName
  );
  return found ? found.name : buildingName;
});

const computedTitle = computed(() => {
  const names = [originalBuildingDisplayName.value, ...displayedBuildings.value];
  return `Electricity Output - ${names.join(' vs ')}`;
});

// WATCH for title changes and push into the chart
watch(computedTitle, (newTitle) => {
  const chartInstance = echarts.getInstanceByDom(chart.value);
  if (chartInstance) {
    chartInstance.setOption({ title: { text: newTitle } });
  }
});

const toggleDropdown = () => {
  showDropdown.value = true;
};

const toggleBuilding = async () => {
  if (!selectedBuilding2.value) return;

  const compareName = selectedBuilding2.value;
  const chartInstance = echarts.getInstanceByDom(chart.value);
  if (!chartInstance) return;

  const option = chartInstance.getOption();

  if (displayedBuildings.value.includes(compareName)) {
    // Remove comparison
    option.series = option.series.filter(
      s => s.name !== `Electricity Out (${compareName})`
    );
    // Update legend data
    option.legend.data = option.series.map(s => s.name);
    chartInstance.setOption(option, true);
    displayedBuildings.value = displayedBuildings.value.filter(b => b !== compareName);
  } else {
    // Add comparison
    try {
      const formatted = formatBuildingName(compareName);
      const { data } = await axios.get(
        `http://localhost:3000/api/tables/hourlyenergybybuilding`,
        { params: { buildingName: formatted } }
      );
      const sorted = data.slice().sort((a, b) => {
        const da = new Date(a.timestamp), db = new Date(b.timestamp);
        return da.getUTCHours() - db.getUTCHours()
          || da.getUTCMinutes() - db.getUTCMinutes();
      });
      const electricityOut = sorted.map(r => r.energy_output || 0);

      option.series.push({
        data: electricityOut,
        type: 'line',
        smooth: true,
        name: `Electricity Out (${compareName})`,
        lineStyle: { type: 'dashed' }
      });
      // Update legend data
      option.legend.data = option.series.map(s => s.name);
      chartInstance.setOption(option, true);
      displayedBuildings.value.push(compareName);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  selectedBuilding2.value = '';
};

onMounted(async () => {
  if (!buildingName) {
    console.warn('No building selected.');
    errorMessage.value = 'No building selected.';
    return;
  }

  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/tables/hourlyenergybybuilding`,
      { params: { buildingName } }
    );
    if (!data || data.length === 0) {
      hasData.value = false;
      return;
    }
    hasData.value = true;

    const sorted = data.slice().sort((a, b) => {
      const da = new Date(a.timestamp), db = new Date(b.timestamp);
      return da.getUTCHours() - db.getUTCHours()
        || da.getUTCMinutes() - db.getUTCMinutes();
    });
    const timestamps = sorted.map(r => r.timestamp);
    const electricityOut = sorted.map(r => r.energy_output || 0);

    await nextTick();
    if (!chart.value) {
      errorMessage.value = 'Failed to initialize the chart.';
      return;
    }

    const chartInstance = echarts.init(chart.value);
    const option = {
      title: {
        text: computedTitle.value,
        left: 'center',
        top: '0%'
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          let tip = `${params[0].axisValue}<br />`;
          params.forEach(p => {
            tip += `${p.seriesName}: ${p.data} kWh<br />`;
          });
          return tip;
        }
      },
      xAxis: {
        type: 'category',
        data: timestamps,
        name: 'Timestamp',
        axisLabel: {
          rotate: 45,
          formatter: v => {
            const d = new Date(v);
            let h = d.getUTCHours(), m = d.getUTCMinutes();
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            const mm = m < 10 ? '0' + m : m;
            return `${h}:${mm}${ampm}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'Electricity (kWh)',
        min: 0
      },
      series: [
        {
          data: electricityOut,
          type: 'line',
          smooth: true,
          areaStyle: {},
          name: 'Electricity Out'
        }
      ]
    };
    chartInstance.setOption(option);
  } catch (error) {
    console.error('Error fetching Athena hourly data:', error);
    errorMessage.value = `Error fetching data: ${error.message}`;
  }
});
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.chart-container {
  width: 100%;
  height: 80%;
}

.compare-section {
  margin-top: 20px;
  text-align: center;
}

.comp-btn {
  padding: 10px 20px;
  background-color: #003b70;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.comp-btn:hover {
  background-color: #00509e;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FF6B6B;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
}
.close-btn:hover {
  background: #e05555;
}

select {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.highlighted {
  font-weight: bold;
  color: green;
}
</style>
