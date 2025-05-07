<template>
  <div class="chart-with-details">
    <button class="close-btn" @click="navigateBack">X</button>
    
    <div v-if="!hasData" class="no-data">No data available for the selected building.</div>
    <div v-else ref="chart" class="chart-container"></div>

    <!-- Compare Section -->
    <div class="compare-section">
      <button v-if="!showDropdown" class="comp-btn" @click="toggleDropdown">Compare</button>
      <div v-else>
        <select v-model="selectedBuilding2" @change="toggleBuilding">
          <option disabled value="">Select a building</option>
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

    <!-- Data Overview -->
    <div class="accordion">
      <details>
        <summary><strong>What does this chart show?</strong></summary>
        <div class="accordion-content">
          <p><strong>kWh (kilowatt-hour)</strong> is a measure of energy. One kilowatt-hour is the energy used by a 1,000-watt appliance running for one hour.</p><br>
          <p>This chart displays the electricity output (in kWh) for the selected building over time, based on hourly data. It helps you visualize trends in energy usage, compare buildings, and identify patterns such as peak usage times.</p>
        </div>
      </details>
    </div>

    <!-- Reading the Graph -->
    <div class="accordion">
      <details>
        <summary><strong>How to Read the Graph</strong></summary>
        <div class="accordion-content">
          <ul>
            <li><strong>X-axis:</strong> Shows time in hourly intervals</li>
            <li><strong>Y-axis:</strong> Shows energy output in kilowatt-hours (kWh)</li>
            <li><strong>Hover</strong> over any point to see exact values and timestamps</li>
            <li><strong>Compare</strong> multiple buildings using the compare button above</li>
          </ul>
        </div>
      </details>
    </div>

    <!-- Solar Panel Distribution -->
    <div class="accordion">
      <details>
        <summary><strong>Solar Panel Information</strong></summary>
        <div class="accordion-content">
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
                <tr v-for="building in buildings" :key="building.name">
                  <td>{{ building.name }}</td>
                  <td>{{ building.panels }}</td>
                </tr>
                <tr class="total">
                  <td><strong>Total Panels</strong></td>
                  <td><strong>{{ totalPanels }}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, computed, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import * as echarts from 'echarts';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const route = useRoute();
const router = useRouter();
const navigateBack = () => router.push('/sources');

const buildingName = route.query.buildingName;
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

const totalPanels = computed(() =>
  buildings.value.reduce((sum, b) => sum + b.panels, 0)
);

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
              `${apiUrl}api/tables/hourlyenergybybuilding`,
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
          `${apiUrl}api/tables/hourlyenergybybuilding`,
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
      `${apiUrl}api/tables/hourlyenergybybuilding`,
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
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn:hover {
  background: #FF2C2C;
}

.chart-container {
  flex: 0 0 400px;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 1.1em;
}

.compare-section {
  margin: 20px 0;
  text-align: center;
}

.comp-btn {
  padding: 10px 20px;
  background-color: #003b70;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
}
.comp-btn:hover {
  background-color: #00509e;
}

select {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1em;
  min-width: 200px;
}

/* Accordion styling copied from examples */
.accordion {
  margin-top: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  color: #003b70;
}

.accordion details {
  width: 100%;
}

.accordion summary {
  cursor: pointer;
  padding: 8px 8px 8px 24px;
  list-style: none;
  position: relative;
}

.accordion summary::-webkit-details-marker {
  display: none;
}

.accordion summary::after {
  content: '►';  /* Right-pointing triangle */
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.3s ease;
  font-weight: normal;
}

.accordion details[open] summary::after {
  transform: translateY(-50%) rotate(90deg);  /* Rotate to point down when open */
}

.accordion-content {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;  /* Changed from #fafafa to white */
  border-radius: 4px;
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

.highlighted {
  font-weight: bold;
  color: #003b70;
}

.accordion strong {
  font-weight: 700;  /* Force bold weight */
}

/* Update the strong styling to be more specific */
.accordion-content strong {
  font-weight: 700;  /* Keep content bold */
}

/* Remove bold from summary strong */
.accordion summary strong {
  font-weight: normal;  /* Remove bold from titles */
}

/* Keep table total row bold */
.panel-info .total {
  font-weight: bold;
}

/* Keep table headers bold */
.panel-info th {
  font-weight: bold;
}

/* Keep highlighted items bold */
.highlighted {
  font-weight: bold;
  color: #003b70;
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
    height: 45vh;
    max-height: none;
    margin-bottom: 15px;
  }
  .accordion {
    padding: 10px;
    font-size: 15px;
  }
  .accordion-content {
    padding: 8px;
  }
  .accordion summary {
    font-size: 16px;
  }
  .panel-info table {
    font-size: 14px;
  }
  .panel-info th,
  .panel-info td {
    padding: 6px;
  }
  .comp-btn {
    padding: 8px 15px;
    font-size: 0.9em;
  }
  select {
    padding: 8px;
    font-size: 0.9em;
    min-width: 180px;
  }
}
</style>
