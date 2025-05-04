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
            :disabled="building.name === originalBuildingDisplayName"
            :class="{ 'highlighted': displayedBuildings.includes(building.name) }"
          >
            {{ building.name }} <span v-if="displayedBuildings.includes(building.name)">✔</span>
          </option>
        </select>
      </div>
    </div>
    <div class="accordion-section">
      <button class="accordion-toggle" @click="showAccordion = !showAccordion">
        What does this chart show?
        <span :class="{ rotated: showAccordion }">▼</span>
      </button>
      <div v-show="showAccordion" class="accordion-content">
        <p><strong>kWh (kilowatt-hour)</strong> is a measure of energy. One kilowatt-hour is the energy used by a 1,000-watt appliance running for one hour.</p>
        <p>This chart displays the electricity output (in kWh) for the selected building over time, based on hourly data. It helps you visualize trends in energy usage, compare buildings, and identify patterns such as peak usage times.</p>
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
const navigateBack = () => router.push('/sources');

const buildingName = route.query.buildingName;
const showAccordion = ref(false);

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

const formatBuildingName = name =>
  name.toLowerCase().replace(/\s+/g, "_");

const originalBuildingDisplayName = computed(() => {
  const found = buildings.value.find(
    b =>
      formatBuildingName(b.name) === buildingName ||
      (buildingName === 'soles' && b.name === 'Soles/MRH')
  );
  return found ? found.name : buildingName;
});

// Break title into lines of up to 5 names each
const computedTitle = computed(() => {
  const names = [originalBuildingDisplayName.value, ...displayedBuildings.value];
  if (!names.length) return 'Electricity Output';
  const chunks = [];
  for (let i = 0; i < names.length; i += 5) {
    chunks.push(names.slice(i, i + 5));
  }
  const lines = chunks.map((chunk, idx) => {
    const line = chunk.join(' vs ');
    return idx === 0 ? `Electricity Output - ${line}` : line;
  });
  return lines.join('\n vs ');
});

watch(computedTitle, newTitle => {
  const inst = echarts.getInstanceByDom(chart.value);
  if (inst) inst.setOption({ title: { text: newTitle } });
});

const toggleDropdown = () => {
  showDropdown.value = true;
};

const toggleBuilding = async () => {
  if (!selectedBuilding2.value) return;
  const compareName = selectedBuilding2.value;
  const inst = echarts.getInstanceByDom(chart.value);
  if (!inst) return;

  const option = inst.getOption();

  if (displayedBuildings.value.includes(compareName)) {
    option.series = option.series.filter(
      s => s.name !== `Electricity Out (${compareName})`
    );
    displayedBuildings.value = displayedBuildings.value.filter(b => b !== compareName);
  } else {
    try {
      const formatted = formatBuildingName(compareName);
      const { data } = await axios.get(
        `http://localhost:3000/api/tables/hourlyenergybybuilding`,
        { params: { buildingName: formatted } }
      );
      const sorted = data.slice().sort((a, b) => {
        const da = new Date(a.timestamp), db = new Date(b.timestamp);
        return da.getUTCHours() - db.getUTCHours() ||
               da.getUTCMinutes() - db.getUTCMinutes();
      });
      const out = sorted.map(r => r.energy_output || 0);

      option.series.push({
        data: out,
        type: 'line',
        smooth: true,
        name: `Electricity Out (${compareName})`,
        lineStyle: { type: 'dashed' }
      });
      displayedBuildings.value.push(compareName);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  option.legend.data = option.series.map(s => s.name);
  inst.setOption(option, true);
  selectedBuilding2.value = '';
};

onMounted(async () => {
  if (!buildingName) {
    errorMessage.value = 'No building selected.';
    return;
  }
  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/tables/hourlyenergybybuilding`,
      { params: { buildingName } }
    );
    if (!data?.length) {
      hasData.value = false;
      return;
    }
    hasData.value = true;

    const sorted = data.slice().sort((a, b) => {
      const da = new Date(a.timestamp), db = new Date(b.timestamp);
      return da.getUTCHours() - db.getUTCHours() ||
             da.getUTCMinutes() - db.getUTCMinutes();
    });
    const timestamps = sorted.map(r => r.timestamp);
    const electricityOut = sorted.map(r => r.energy_output || 0);

    await nextTick();
    const inst = echarts.init(chart.value);
    const initialName = `Electricity Out (${originalBuildingDisplayName.value})`;
    const option = {
      title: {
        text: computedTitle.value,
        left: 'center',
        top: '0%',
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          const date = new Date(params[0].axisValue);
          const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
          const dd = String(date.getUTCDate()).padStart(2, '0');
          const yyyy = date.getUTCFullYear();
          let h = date.getUTCHours();
          const ampm = h >= 12 ? 'PM' : 'AM';
          h = h % 12 || 12;
          const m = String(date.getUTCMinutes()).padStart(2, '0');
          
          let tip = `${mm}/${dd}/${yyyy} ${h}:${m}${ampm}<br/>`;
          params.forEach(p => {
            const buildingName = p.seriesName.match(/\((.*?)\)/)[1];
            tip += `${p.marker} ${buildingName}: ${parseFloat(p.data).toFixed(2)} kWh<br/>`;
          });
          return tip;
        }
      },
      legend: {
        show: false,
        top: '10%',
        left: 'center',
        orient: 'horizontal',
        icon: 'circle',
        itemGap: 20,
        data: [ initialName ],
        textStyle: { fontSize: 12, color: '#333' }
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
            return `${h}:${m < 10 ? '0'+m : m}${ampm}`;
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
          name: initialName,
          itemStyle: { borderWidth: 2 },
          emphasis: { focus: 'series' }
        }
      ]
    };
    inst.setOption(option);
  } catch (error) {
    console.error('Error fetching data:', error);
    errorMessage.value = `Error fetching data: ${error.message}`;
  }
});
</script>

<style scoped>
/* Styles for screens larger than 768px (tablets and desktops) */
@media (min-width: 768px) {
  .chart-wrapper {
    padding-top: 40px;  /* Adjust for larger screens */
  }

  .chart-container {
    height: 70%;  /* Take up less space on bigger screens */
  }

  .accordion-section {
    margin-top: 20px;
  }
}

/* Styles for small screens like phones (max-width 768px) */
@media (max-width: 768px) {
  .chart-wrapper {
    padding-top: 10px;  /* Less padding on smaller screens */
    padding-bottom: 20px; /* Add some padding at the bottom */
  }

  .chart-container {
    height: 60%;  /* Make the chart take less space on small screens */
  }

  .accordion-section {
    margin-top: 8px;
    width: 100%; /* Make the accordion section take up the full width */
  }

  .comp-btn {
    padding: 8px 15px; /* Make the compare button smaller */
  }

  .close-btn {
    top: 5px;
    right: 5px;
    width: 32px;
    height: 32px;
    font-size: 18px; /* Smaller close button */
  }

  select {
    font-size: 14px; /* Make the select dropdown smaller */
  }
}

/* Styles for very small devices (e.g., iPhone 12) */
@media (max-width: 375px) {
  .chart-wrapper {
    padding-top: 5px;
    padding-bottom: 10px;
  }

  .chart-container {
    height: 50%;  /* Make the chart take even less space on small devices */
  }

  .accordion-section {
    margin-top: 4px;
  }

  .comp-btn {
    padding: 6px 12px;  /* Smaller padding for mobile */
  }

  .close-btn {
    top: 3px;
    right: 3px;
    width: 28px;
    height: 28px;
    font-size: 16px;
  }

  select {
    font-size: 12px; /* Smaller font size for the select dropdown */
  }
}
.chart-wrapper {
  overflow: auto;
  width: 100%;
  height: 100vh;
  padding-top: 20px;
  box-sizing: border-box;
  border-radius: 8px; 
  background: #ffffff;
  display: flex;
  flex-direction: column; /* Stack items vertically */
  align-items: center; /* Center items horizontally */
  justify-content: flex-start; /* Align items at the top */
  position: relative;
}

.chart-container {
  width: 100%;
  height: 70%;
  flex-grow: 1;
}

.accordion-section {
  margin-top: 16px;
  width: 90%;
  max-width: 600px;
  text-align: left;
  color: black;
}

.accordion-toggle {
  background-color: #f0f0f0;
  color: #003b70;
  border: none;
  padding: 10px 15px;
  width: 100%;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.accordion-toggle:hover {
  background-color: #e0e0e0;
}

.accordion-toggle span {
  transition: transform 0.3s ease;
}

.accordion-toggle span.rotated {
  transform: rotate(180deg);
}

.accordion-content {
  background-color: #fafafa;
  padding: 12px 15px;
  border-radius: 4px;
  margin-top: 8px;
  border: 1px solid #ddd;
  overflow-y: auto;
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


select {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.highlighted {
  font-weight: bold;
  color: green;
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
