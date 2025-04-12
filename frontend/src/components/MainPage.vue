<template>
  <AppLayout>
    <main class="main-content">
      <div class="visual-container">
        <!-- Upper left square -->
        <div class="visual-section" role="button" @click="navigateToBarChart">
          <BarChart/>
        </div>
        <!-- Upper right square -->
        <div class="visual-section" role="button" @click="navigateToBubbleChart">
          <BubbleChart/>
        </div>
        <!-- Lower left square -->
        <div class="visual-section" role="button" @click="navigateToPieChart"> 
          <PieChart/>
        </div>
        <!-- Lower right square -->
        <div class="visual-section"></div>
      </div>
      <div class="bottom-visual-container">
        <div class="wide-visual-section" role="button" @click="navigateToLineChart">
          <LineChart/>
        </div>
      </div>
    </main>
  </AppLayout> 
</template>


<script setup>
/**
 * @file MainPage.vue
 * @description This Vue component represents the main dashboard page. It includes a header, navigation sidebar, and placeholders for dashboard visuals and data upload functionality.
 */

import { useRouter} from 'vue-router'; // Import Vue Router for navigation
import AppLayout from './AppLayout.vue';
import BarChart from './BarChart.vue';
import BubbleChart from './BubbleChart.vue';
import PieChart from './PieChart.vue';
import LineChart from './LineChart.vue';

const router = useRouter();

/**
 * Navigate to the Bar Chart page.
 * Triggered when the "Bar Chart" navigation item is clicked.
 */
const navigateToBarChart = () => {
  router.push('/bar-chart'); 
};

/**
 * Navigate to the Bubble Chart page.
 * Triggered when the "Bubble Chart" navigation item is clicked.
 */
const navigateToBubbleChart = () => {
  router.push('/bubble-chart'); // Replace '/bubble-chart' with your actual route for the Bubble Chart page
};

/**
 * Navigate to the Pie Chart page.
 * Triggered when the "Pie Chart" navigation item is clicked.
 */
const navigateToPieChart = () => {
  router.push('/pie-chart'); // Replace '/bubble-chart' with your actual route for the Bubble Chart page
};

/**
 * Navigate to the Line Chart page.
 * Triggered when the "Line Chart" navigation item is clicked.
 */
const navigateToLineChart = () => {
  router.push('/line-chart'); // Replace '/line-chart' with your actual route for the Line Chart page
};
</script>

<style scoped>
/**
 * Styles for the main dashboard page.
 * Scoped styles ensure these styles apply only to this component.
 */

/* Reset styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-content {
    width: 100%;
    max-width: 1400px;  
    margin: 0 auto;      /* centers it */
    padding: 20px;       
    box-sizing: border-box;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Visual container styles */
.visual-container {
    background: transparent;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 18px;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    height: calc(100vh - 71px - 40px);
    border-radius: 8px;
}

.visual-section {
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden; 
    position: relative;
    border-radius: 8px;
    padding: 10px; /* give breathing space to the chart */
    box-sizing: border-box;
    border: 2px solid rgba(0,0,0,0.05);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.visual-section > * {
    width: 100%;
    height: 100%;
    border-radius: inherit;
    border-radius: 8px; 
}

/* Bottom visual container styles */
.bottom-visual-container {
    background: transparent;
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 8px;
    position: relative;
    z-index: 1; /* Ensure it is above other elements */
}

.wide-visual-section {
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 400px;
    overflow: hidden; 
    position: relative;
    border-radius: 8px;
    padding: 10px; /* give breathing space to the chart */
    box-sizing: border-box;
    border: 2px solid rgba(0,0,0,0.05);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.wide-visual-section > * {
    width: 100%;
    height: 100%;
    border-radius: inherit;
    border-radius: 8px; 
}
</style>