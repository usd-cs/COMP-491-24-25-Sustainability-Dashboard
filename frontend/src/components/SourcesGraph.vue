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
          <!-- Compare All option with checkmark -->
          <option value="ALL" :class="{ 'highlighted': displayedBuildings.includes('ALL') }">
            Compare All <span v-if="displayedBuildings.includes('ALL')">✔</span>
          </option>
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
  { name: "Alcala Borrego", panels: 126 },
  { name: "Alcala Laguna", panels: 126 },
  { name: "Camino Hall", panels: 980 },
  { name: "Copley Library", panels: 266 },
  { name: "Founders Hall", panels: 308 },
  { name: "Jenny Craig Pavilion", panels: 910 },
  { name: "Kroc", panels: 512 },
  { name: "Manchester A", panels: 272 },
  { name: "Manchester B", panels: 272 },
  { name: "Soles/MRH", panels: 546 },
  { name: "West Parking", panels: 896 }
]);

const formatBuildingName = name => {
  if (name.toLowerCase() === 'soles/mrh') {
    return 'soles';
  }
  return name.toLowerCase().replace(/\s+/g, "_");
};

const originalBuildingDisplayName = computed(() => {
  const found = buildings.value.find(
    b =>
      formatBuildingName(b.name) === buildingName ||
      (buildingName === 'soles' && b.name === 'Soles/MRH')
  );
  return found ? found.name : buildingName;
});

const computedTitle = computed(() => {
  const base = originalBuildingDisplayName.value;
  if (displayedBuildings.value.includes('ALL')) {
    return `${base} vs All Solar Sites`;
  }
  const names = [ base, ...displayedBuildings.value.filter(b => b !== 'ALL') ];
  if (!names.length) return 'Electricity Output';
  const chunks = [];
  for (let i = 0; i < names.length; i += 5) {
    chunks.push(names.slice(i, i + 5));
  }
  const lines = chunks.map((chunk, idx) => {
    const line = chunk.join(' vs ');
    return idx === 0 ? `Electricity Output - ${line}` : line;
  });
  return lines.join('\n');
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
  const inst = echarts.getInstanceByDom(chart.value);
  if (!inst) return;

  try {
    const option = inst.getOption();
    const value = selectedBuilding2.value;

    if (value === 'ALL') {
      if (displayedBuildings.value.includes('ALL')) {
        displayedBuildings.value = [];
        option.series = option.series.filter(s =>
          s.name.includes(originalBuildingDisplayName.value)
        );
      } else {
        displayedBuildings.value = ['ALL'];
        option.title = {
          text: `${originalBuildingDisplayName.value} vs All Solar Sites`,
          left: '50%',
          top: '2%',
          textAlign: 'center',
          x: 'center',
        };
        option.series = option.series.filter(s =>
          s.name.includes(originalBuildingDisplayName.value)
        );
        const others = buildings.value
          .map(b => b.name)
          .filter(n => n !== originalBuildingDisplayName.value);
        await Promise.all(
          others.map(async name => {
            const formatted = formatBuildingName(name);
            const { data } = await axios.get(
              `http://localhost:3000/api/tables/hourlyenergybybuilding`,
              { params: { buildingName: formatted } }
            );
            const sorted = data.slice().sort((a, b) => {
              const da = new Date(a.timestamp), db = new Date(b.timestamp);
              return da.getUTCHours() - db.getUTCHours() ||
                     da.getUTCMinutes() - db.getUTCHours();
            });
            const out = sorted.map(r => r.energy_output || 0);
            option.series.push({
              data: out,
              type: 'line',
              smooth: true,
              name: `Electricity Out (${name})`,
              lineStyle: { type: 'dashed' }
            });
          })
        );
      }
    } else {
      if (displayedBuildings.value.includes('ALL')) {
        displayedBuildings.value = [];
        option.series = option.series.filter(s =>
          s.name.includes(originalBuildingDisplayName.value)
        );
      }
      const compareName = value;
      if (displayedBuildings.value.includes(compareName)) {
        option.series = option.series.filter(
          s => s.name !== `Electricity Out (${compareName})`
        );
        displayedBuildings.value = displayedBuildings.value.filter(b => b !== compareName);
      } else {
        const formatted = formatBuildingName(compareName);
        const { data } = await axios.get(
          `http://localhost:3000/api/tables/hourlyenergybybuilding`,
          { 
            params: { buildingName: formatted },
            validateStatus: status => status < 500
          }
        );
        const sorted = data.slice().sort((a, b) => {
          const da = new Date(a.timestamp), db = new Date(b.timestamp);
          return da.getUTCHours() - db.getUTCHours() ||
                 da.getUTCMinutes() - db.getUTCHours();
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
      }
    }

    option.title = {
      text: computedTitle.value,
      left: '50%',
      top: '2%',
      textAlign: 'center',
      x: 'center',
    };
    option.legend.data = option.series.map(s => s.name);
    inst.setOption(option, true);
    selectedBuilding2.value = '';
  } catch (err) {
    console.error('Error in toggleBuilding:', err);
    errorMessage.value = 'Failed to load building data. Please try again.';
  }
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
             da.getUTCMinutes() - db.getUTCHours();
    });
    const timestamps = sorted.map(r => r.timestamp);
    const electricityOut = sorted.map(r => r.energy_output || 0);

    await nextTick();
    const inst = echarts.init(chart.value);
    const initialName = `Electricity Out (${originalBuildingDisplayName.value})`;
    const option = {
      title: {
        text: computedTitle.value,
        left: '50%',
        top: '2%',
        textAlign: 'center',
        x: 'center',
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
            const buildingMatch = p.seriesName.match(/\((.*?)\)/);
            const name = buildingMatch ? buildingMatch[1] : p.seriesName;
            const b = buildings.value.find(b => b.name === name);
            const panelInfo = b ? ` (${b.panels} panels)` : '';
            tip += `${p.marker} ${name}: ${parseFloat(p.data).toFixed(2)} kWh${panelInfo}<br/>`;
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
    padding-top: 40px;  
  }
  .chart-container {
    height: 70%;  
  }
  .accordion-section {
    margin-top: 20px;
  }
}
/* Styles for small screens like phones (max-width 768px) */
@media (max-width: 768px) {
  .chart-wrapper {
    padding-top: 10px;  
    padding-bottom: 20px; 
  }
  .chart-container {
    height: 60%;  
  }
  .accordion-section {
    margin-top: 8px;
    width: 100%; 
  }
  .comp-btn {
    padding: 8px 15px; 
  }
  .close-btn {
    top: 5px;
    right: 5px;
    width: 32px;
    height: 32px;
    font-size: 18px; 
  }
  select {
    font-size: 14px; 
  }
}
/* Styles for very small devices (e.g., iPhone 12) */
@media (max-width: 375px) {
  .chart-wrapper {
    padding-top: 5px;
    padding-bottom: 10px;
  }
  .chart-container {
    height: 50%;  
  }
  .accordion-section {
    margin-top: 4px;
  }
  .comp-btn {
    padding: 6px 12px;  
  }
  .close-btn {
    top: 3px;
    right: 3px;
    width: 28px;
    height: 28px;
    font-size: 16px;
  }
  select {
    font-size: 12px; 
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
  flex-direction: column; 
  align-items: center; 
  justify-content: flex-start; 
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
</style>
