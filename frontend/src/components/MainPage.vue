<template>
  <!-- Main container for the dashboard page -->
  <div class="dashboard-container">
    <!-- Header section with the application title and logout button -->
    <header class="header">
      <div class="header-content">
        <!-- Clickable logo -->
        <a href="https://www.sandiego.edu/" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.sandiego.edu/brand/images/logos/master-secondary/usd-logo-secondary-2c-reversed.png"
            alt="University of San Diego Logo"
            class="logo"
          />
        </a>
        <h1 class="title">USD Office of Sustainability</h1>
      </div>
      <!-- Logout button -->
      <div class="user-section">
        <button class="logout-btn" @click="handleLogout" tabindex="0">
          Logout →
        </button>
      </div>
    </header>

    <!-- Main content area of the dashboard -->
    <main class="main-content">
        <!-- Sidebar with navigation items -->
      <div class="sidebar">
        <div class="sidebar-content">
          <nav class="navigation-menu">
            <!-- Navigation items for future use -->
            <div class="nav-item" tabindex="0" role="button" @click="navigateToMain">Summary</div>
            <div class="nav-item" tabindex="0" role="button">Sources</div>
            <div class="nav-item" tabindex="0" role="button">Reports</div>
            <div class="nav-item" tabindex="0" role="button">Contact</div>
          </nav>
          <!-- Button to navigate to the upload data page -->
          <button class="upload-button" @click="navigateToUpload" tabindex="0">Upload Data</button>
        </div>
      </div>

      <!-- Placeholder for dashboard visuals -->
      <div class="visual-container">
        <div class="visual-section" role="button" @click="navigateToBarChart">
          <!-- Placeholder for the first graphic visual -->
          <BarChart/>
        </div>
        <div class="visual-section" role="button" @click="navigateToBubbleChart">
          <!-- Placeholder for the second graphic visual -->
          <BubbleChart/>
        </div>
        <div class="visual-section" role="button" @click="navigateToPieChart"> 
          <!-- Placeholder for the third graphic visual -->
          <PieChart/>
        </div>
        <div class="visual-section">
          <!-- Placeholder for the fourth graphic visual -->
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
/**
 * @file MainPage.vue
 * @description This Vue component represents the main dashboard page. It includes a header, navigation sidebar, and placeholders for dashboard visuals and data upload functionality.
 */

import { useRouter } from 'vue-router'; // Import Vue Router for navigation
import BarChart from './BarChart.vue';
import BubbleChart from './BubbleChart.vue';
import PieChart from './PieChart.vue';


const router = useRouter(); // Vue Router instance for programmatic navigation

/**
 * Navigate to the data upload page.
 * Triggered when the "Upload Data" button in the sidebar is clicked.
 */
const navigateToUpload = () => {
  router.push('/select');
};

const navigateToMain = () => {
  router.push('/main');
};

/**
 * Handle user logout.
 * Clears session and redirects the user to the login page.
 */
const handleLogout = () => {
  router.push('/');
};

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

/* Main container for the dashboard page */
.dashboard-container {
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y:auto;
}

/* Header styling */
.header {
  background-color: #003b70; /* Official USD dark blue */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
  box-sizing: border-box;
  width: 100%;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align content to the left */
}

.logo {
  height: 40px;
  margin-bottom: 10px; /* Add spacing between the logo and the title */
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
  text-align: left;
}

.user-section {
  display: flex;
  align-items: center;
}

.logout-btn {
  background-color: transparent;
  color: #ffffff;
  font: 400 16px Inter, sans-serif;
  border: 1px solid #ffffff;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #ffffff;
  color: #003b70;
}

/* Main content styles */
.main-content {
  display: flex;
  width: 100%;
  overflow: auto; /* Prevent scrolling */
  align-items: flex-start;
}

/* Sidebar styles */
.sidebar {
  display: flex;
  flex-direction: column;
  width: 15%;
  height: 100%; /* Make sidebar take full height */
  padding-bottom: 3px; /* Same as dashboard-container padding-bottom */
  box-sizing: border-box; /* Ensure padding is included in the width */
  margin-left: 20px;
}

.sidebar-content {
  background: #003b70;
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
  padding: 15px;
  margin-top: 20px;
  height: 80vh; /* Make sidebar content take full height */
  color: #000;
}

.navigation-menu {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 23px;
}

.nav-item {
  background: #fff;
  padding: 8px 1px;
  cursor: pointer;
  display: flex; /* Use Flexbox */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: #75bee9;
  color: #fff;
  border-radius: 4px;
}

.upload-button {
  background: #fff;
  margin-top: 20px;
  font-size: 15px;
  padding: 5px 15px;
  border: none;
  cursor: pointer;
}

/* Visual container styles */
.visual-container {
  background: #003b70;
  display: grid;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 18px; /* Reduce the gap between the visual containers */
  width: 100%; /* Adjust the width to fit within the viewport */
  margin: 20px;
  padding-top: 20px;
  padding-right: 20px;
  padding-left: 20px; 
  padding-bottom: 20px;
  height: 80vh; /* Make visual container take full height */
  grid-template-areas: 
    "chart1 chart2"
    "chart3 chart4";
}

.visual-section:nth-child(1) { grid-area: chart1; } /* Top-left */
.visual-section:nth-child(2) { grid-area: chart2; }
.visual-section:nth-child(3) { grid-area: chart3; }
.visual-section:nth-child(4) { grid-area: chart4; }


.visual-section {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
}
.visual-section > * {
  width: 100%;
  height: 100%;
  /* border: 1px solid red; For debugging */
}
</style>
