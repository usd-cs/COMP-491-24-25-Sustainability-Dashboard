<template>
  <div class="chart-wrapper">
    <div v-if="!hasData">No data available for the selected building.</div>
    <div v-else ref="chart" class="chart-container"></div>
    <!-- Add the Compare button and dropdown -->
    <div class="compare-section">
      <button v-if="!showDropdown" @click="toggleDropdown">Compare</button>
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
import { onMounted, ref, nextTick } from 'vue';
import { useRoute } from "vue-router";
import * as echarts from 'echarts';
import axios from 'axios';

const route = useRoute();
const buildingName = route.query.buildingName; // Retrieve the building name from query parameters

const chart = ref(null);
const hasData = ref(false); // Notify user if data is not available
const errorMessage = ref('');
const showDropdown = ref(false); // Controls the visibility of the dropdown
const selectedBuilding2 = ref(''); // Stores the second building name
const displayedBuildings = ref([]); //  reactive property to track the buildings currently displayed on the chart.
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

const toggleDropdown = () => {
  showDropdown.value = true;
};
const isBuildingDisplayed = (buildingName) => {
  const chartInstance = echarts.getInstanceByDom(chart.value);
  if (chartInstance) {
    const option = chartInstance.getOption();
    return option.series.some(series => series.name === `Electricity Out (${buildingName})`);
  }
  return false;
};
// Function to format the building name for the URL
const formatBuildingName = (name) => {
  return name.toLowerCase().replace(/\s+/g, "_"); // Convert to lowercase and replace spaces with underscores
};

const toggleBuilding = async () => {
  if (!selectedBuilding2.value) return;

  const buildingName = selectedBuilding2.value;
  
  // Check if the building is already displayed
  if (displayedBuildings.value.includes(buildingName)) {
    // Remove the building from the chart
    const chartInstance = echarts.getInstanceByDom(chart.value);
    if (chartInstance) {
      const option = chartInstance.getOption();
      
      // Filter out the series for this building
      const updatedSeries = option.series.filter(
        series => series.name !== `Electricity Out (${buildingName})`
      );
      
      // Update the chart
      chartInstance.setOption({ ...option, series: updatedSeries }, true);
      
      // Remove from displayedBuildings
      displayedBuildings.value = displayedBuildings.value.filter(
        building => building !== buildingName
      );
    }
  } else {
    // Add the building to the chart
    const formattedName = formatBuildingName(buildingName);
    
    try {
      // Fetch data for the building
      const response = await axios.get(`http://localhost:3000/api/tables/hourlyenergybybuilding`, {
        params: { buildingName: formattedName }
      });
      const data = response.data;
      
       // Sort data by UTC hour and minute (starting at 12AM) and extract electricity output
       const sortedData = data.slice().sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        const hourA = dateA.getUTCHours();
        const hourB = dateB.getUTCHours();
        if (hourA === hourB) {
          return dateA.getUTCMinutes() - dateB.getUTCMinutes();
        }
        return hourA - hourB;
      });
      const electricityOut = sortedData.map(row => row.energy_output || 0);
      
      // Add to chart
      const chartInstance = echarts.getInstanceByDom(chart.value);
      if (chartInstance) {
        const option = chartInstance.getOption();
        option.series.push({
          data: electricityOut,
          type: 'line',
          smooth: true,
          name: `Electricity Out (${buildingName})`,
          lineStyle: {
            type: 'dashed'
          }
        });
        
        chartInstance.setOption(option);
        
        // Add to displayedBuildings
        displayedBuildings.value.push(buildingName);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Reset selection
  selectedBuilding2.value = '';
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
    const sortedData = data.slice().sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      const hourA = dateA.getUTCHours();
      const hourB = dateB.getUTCHours();
      if (hourA === hourB) {
          return dateA.getUTCMinutes() - dateB.getUTCMinutes();
      }
      return hourA - hourB;
    });
    const timestamps = sortedData.map(row => row.timestamp);
    const electricityOut = sortedData.map(row => row.energy_output || 0); // Use 0 if missing

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
          formatter: value => {
              const date = new Date(value);
              let hours = date.getUTCHours();
              const minutes = date.getUTCMinutes();
              const ampm = hours >= 12 ? 'PM' : 'AM';
              hours = hours % 12;
              hours = hours ? hours : 12;
              const minuteStr = minutes < 10 ? '0' + minutes : minutes;
              return `${hours}:${minuteStr}${ampm}`;
          }
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

.highlighted {
  font-weight: bold;
  color: green;
}
</style>

