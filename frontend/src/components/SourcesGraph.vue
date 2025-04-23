<template>
  <div class="chart-wrapper">
    <!-- Close (X) Button -->
<button class="close-button" @click="goBack">X</button>
    <div v-if="!hasData">No data available for the selected building.</div>
    <div v-else ref="chart" class="chart-container"></div>
    <!-- Add the Compare button and dropdown -->
    <div class="compare-section">
      <button v-if="!showDropdown" @click="toggleDropdown">Compare</button>
      <div v-else>
        <select v-model="selectedBuilding2" @change="updateBuilding2">
          <option disabled value="">Select a building</option>
          <option v-for="building in buildings" :key="building.name" :value="building.name">
            {{ building.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { useRoute } from "vue-router";
import * as echarts from 'echarts';
import axios from 'axios';
import router from '@/router/router';

const route = useRoute();
const buildingName = route.query.buildingName; // Retrieve the building name from query parameters

const chart = ref(null);
const hasData = ref(false); // Notify user if data is not available
const errorMessage = ref('');
const showDropdown = ref(false); // Controls the visibility of the dropdown
const selectedBuilding2 = ref(''); // Stores the second building name
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
  { name: "Soles" },
  { name: "West Parking" }
]);

const goBack = () => {
  history.length ? history.back() : (window.location.href = '/');
};

const toggleDropdown = () => {
  showDropdown.value = true;
};
// Function to format the building name for the URL
const formatBuildingName = (name) => {
  return name.toLowerCase().replace(/\s+/g, "_"); // Convert to lowercase and replace spaces with underscores
};

const updateBuilding2 = async () => {
  if (!selectedBuilding2.value) return;

  const formattedName = formatBuildingName(selectedBuilding2.value); // Format the building name

  try {
    // Fetch data for the second building
    const response2 = await axios.get(`http://localhost:3000/api/tables/hourlyenergybybuilding`, {
      params: { buildingName: formattedName } // Pass selected building name as a query parameter
    });
    const data2 = response2.data;

    // Extract timestamps and electricity output data for the second building
    const timestamps2 = data2.map(row => row.timestamp);
    const electricityOut2 = data2.map(row => row.energy_output || 0); // Use 0 if missing

    // Update the chart with the second building's data
    const chartInstance = echarts.getInstanceByDom(chart.value);
    if (chartInstance) {
      const option = chartInstance.getOption();
      option.series.push({
        data: electricityOut2,
        type: 'line',
        smooth: true,
        name: `Electricity Out (${selectedBuilding2.value})`,
        lineStyle: {
          type: 'dashed' // Optional: Make the line dashed for distinction
        }
      });
      chartInstance.setOption(option);
    }
  } catch (error) {
    console.error('Error fetching data for the second building:', error);
    errorMessage.value = `Error fetching data: ${error.response ? error.response.data.message : error.message}`;
  }
};

onMounted(async () => {
  if (!buildingName) {
    console.warn('No building selected.');
    errorMessage.value = 'No building selected.';
    return;
  }
  console.log('Request received:', buildingName);
  try {
    // Make the GET request with the building name as a URL parameter
    const response = await axios.get(`http://localhost:3000/api/tables/hourlyenergybybuilding`, {
      params: { buildingName } // Pass buildingName as a query parameter
    });
    const data = response.data;

    if (!data || data.length === 0) {
      console.warn('No Athena data available.');
      hasData.value = false;
      return;
    }

    hasData.value = true; // Set hasData to true if data is available

    // Extract timestamps and electricity output data
    const timestamps = data.map(row => row.timestamp);
    const electricityOut = data.map(row => row.energy_output || 0); // Use 0 if missing

    // Wait for the DOM to be updated before initializing the chart
    await nextTick();

    if (!chart.value) {
      console.error('Chart DOM element is not available.');
      errorMessage.value = 'Failed to initialize the chart.';
      return;
    }

    // Initialize the chart instance
    const chartInstance = echarts.init(chart.value);

    // Configure the chart
    const option = {
      title: {
        text: 'Electricity Output Over Time', // Chart title
        left: 'center', // Center the title horizontally
        top: 'top', // Position the title at the top
        textStyle: {
          fontSize: 16, // Adjust font size
          fontWeight: 'bold'
      }
    },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          let tooltip = `${params[0].axisValue}<br />`;
          params.forEach(param => {
            tooltip += `${param.seriesName}: ${param.data} kWh<br />`;
          });
          return tooltip;
        }
      },
      xAxis: {
        type: 'category',
        data: timestamps,
        name: 'Timestamp',
        axisLabel: {
          rotate: 45,
          formatter: value => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      },
      yAxis: {
        type: 'value',
        name: 'Electricity (kWh)'
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

    chartInstance.setOption(option); // Set the chart option
  } catch (error) {
      console.error('Error fetching Athena hourly data:', error);
      errorMessage.value = `Error fetching data: ${error.response ? error.response.data.message : error.message}`;
  }
});
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 8px; /* Match your box rounding */
  background: #ffffff;
  display: flex;
  flex-direction: column; /* Stack items vertically */
  align-items: center; /* Center items horizontally */
  justify-content: flex-start; /* Align items at the top */
}

.chart-container {
  width: 100%;
  height: 80%;
  margin-top: 20px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #555;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 10;
}

.close-button:hover {
  color: #000;
}


.compare-section {
  margin-top: 20px;
  text-align: center;
}

button {
  padding: 10px 20px;
  background-color: #003b70;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #00509e;
}

select {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>

