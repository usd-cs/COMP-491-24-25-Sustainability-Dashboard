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
import { onMounted, ref, nextTick } from 'vue';
import { useRoute,useRouter } from "vue-router";
import * as echarts from 'echarts';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const navigateBack = () => {
  router.push('/sources');
};
const buildingName = route.query.buildingName; // Retrieve the building name from query parameters

const chart = ref(null);
const hasData = ref(false); // Notify user if data is not available
const errorMessage = ref('');
const showDropdown = ref(false); // Controls the visibility of the dropdown
const selectedBuilding2 = ref(''); // Stores the second building name
const displayedBuildings = ref([]); //  reactive property to track the buildings currently displayed on the chart.

// Update buildings array to include dbName for special cases
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
  { name: "Soles/MRH", dbName: "soles" },
  { name: "West Parking" },
  { name: "Bloom Fuel Cell", disabled: true }
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
// Function to format the building name for database queries
const formatBuildingName = (name) => {
  const mappings = {
    'Soles/MRH': 'soles',
    'Jenny Craig Pavilion': 'jenny_craig_pavilion',
    // Add any other special cases here
  };

  // Check if we have a special mapping for this building
  if (mappings[name]) {
    return mappings[name];
  }

  // Default formatting for other buildings
  return name.toLowerCase().replace(/\s+/g, '_');
};

// Add this helper function at the top of your script
const getDisplayName = (dbName) => {
  // Find the building with matching name or dbName
  const building = buildings.value.find(b => 
    b.dbName === dbName || 
    formatBuildingName(b.name) === dbName
  );
  return building ? building.name : dbName;
};

// Add this helper function after your existing imports
const updateChartTitle = (chartInstance, buildings) => {
  const option = chartInstance.getOption();
  const title = buildings.length > 1 
    ? `Comparing: ${buildings.join(' vs ')}`
    : `Electricity Output: ${buildings[0]}`;
    
  option.title = {
    text: title,
    left: 'center',
    top: '0%',
    textStyle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#003b70'
    }
  };
  
  chartInstance.setOption(option);
};

// Modify the toggleBuilding function to update the title
const toggleBuilding = async () => {
  if (!selectedBuilding2.value) return;

  const building = buildings.value.find(b => b.name === selectedBuilding2.value);
  const queryName = building.dbName || formatBuildingName(building.name);
  
  // Check if the building is already displayed
  if (displayedBuildings.value.includes(building.name)) {
    // Remove the building from the chart
    const chartInstance = echarts.getInstanceByDom(chart.value);
    if (chartInstance) {
      const option = chartInstance.getOption();
      
      // Find the index of the series to remove
      const seriesIndex = option.series.findIndex(
        series => series.name === `Electricity Out (${building.name})`
      );
      
      if (seriesIndex !== -1) {
        // Remove the series
        option.series.splice(seriesIndex, 1);
        
        // Update the chart with the modified series
        chartInstance.clear();  // Clear the existing chart
        chartInstance.setOption(option);
        
        // Remove from displayedBuildings
        displayedBuildings.value = displayedBuildings.value.filter(
          name => name !== building.name
        );
        
        // Update the title after removing the building
        updateChartTitle(chartInstance, displayedBuildings.value);
      }
    }
  } else {
    try {
      // Use queryName for the API request
      const response = await axios.get(`http://localhost:3000/api/tables/hourlyenergybybuilding`, {
        params: { buildingName: queryName }
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
          name: `Electricity Out (${building.name})`,
          lineStyle: {
            type: 'dashed'
          }
        });
        
        chartInstance.setOption(option);
        
        // Add to displayedBuildings
        displayedBuildings.value.push(building.name);
        
        // Update the title after adding the building
        updateChartTitle(chartInstance, displayedBuildings.value);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Reset selection
  selectedBuilding2.value = '';
};

// Update the initial chart creation in onMounted
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
        text: `Electricity Output: ${getDisplayName(buildingName)}`, // Use the formatted display name
        left: 'center',
        top: '0%',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#003b70'
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
        name: 'Electricity (kWh)',
        min: 0  // Set minimum value to 0
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

    // Initialize displayedBuildings with the proper display name
    displayedBuildings.value = [getDisplayName(buildingName)];

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
  padding-top: 20px;
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
  min-width: 200px;
}

.comp-btn {
  padding: 8px 16px;
  background-color: #fff;
  color: #003b70;
  border: 2px solid #003b70;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.comp-btn:hover {
  background-color: #003b70;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.comp-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.close-btn:hover {
  background: #e05555;
}

select {
  padding: 8px 16px;
  background-color: #fff;
  color: #003b70;
  border: 2px solid #003b70;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-width: 200px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23003b70%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  padding-right: 30px;
}

select:hover {
  border-color: #003b70;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}

select:focus {
  outline: none;
  border-color: #003b70;
  box-shadow: 0 0 0 3px rgba(0,59,112,0.2);
}

option {
  padding: 8px;
  color: #003b70;
}

option:checked {
  background-color: #003b70;
  color: white;
}

.highlighted {
  color: #003b70;
  font-weight: 600;
  background-color: rgba(0,59,112,0.1);
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
</style>

