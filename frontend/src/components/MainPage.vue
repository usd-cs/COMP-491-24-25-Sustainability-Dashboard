<template>
  <div class="background-pattern"></div>
  <div class="dashboard-container">
    <!-- New Navigation Bar -->
    <header class="nav-menu">
      <div class="nav-content">
        <div class="logo">
          <a href="https://www.sandiego.edu/" target="_blank" rel="noopener noreferrer">
            <img src="https://www.sandiego.edu/brand/images/logos/master-secondary/usd-logo-secondary-2c-reversed.png" alt="USD Logo" class="logo-img">
          </a>
        </div>
        <ul class="nav-items">
          <li class="navLi"><router-link to="/main" class="navLink" active-class="active" @click.prevent="navigateToMain">Summary</router-link></li>
          <li class="navLi"><router-link to="/sources" class="navLink" active-class="active" @click.prevent="navigateToSources">Sources</router-link></li>
          <li class="navLi"><router-link to="/initiatives" class="navLink" active-class="active" @click.prevent="navigateToInitiatives">Initiatives</router-link></li>
          <li class="navLi"><router-link to="/contact" class="navLink" active-class="active" @click.prevent="navigateToContact">Contact</router-link></li>
        </ul>
        <!-- logout button separated -->
        <button class="logout-btn" @click="handleLogout" tabindex="0">Logout →</button>
      </div>
    </header>


    <!-- Main content area of the dashboard -->
    <main class="main-content">
      <!-- Main visuals -->
      <div class="visual-container">
        <div class="visual-section" role="button" @click="navigateToBarChart">
          <BarChart/>
        </div>
        <div class="visual-section" role="button" @click="navigateToBubbleChart">
          <BubbleChart/>
        </div>
        <div class="visual-section" role="button" @click="navigateToPieChart"> 
          <PieChart/>
        </div>
        <div class="visual-section"></div>
      </div>
    </main>
  </div>
</template>


<script setup>
/**
 * @file MainPage.vue
 * @description This Vue component represents the main dashboard page. It includes a header, navigation sidebar, and placeholders for dashboard visuals and data upload functionality.
 */

import { useRouter, useRoute } from 'vue-router'; // Import Vue Router for navigation
import BarChart from './BarChart.vue';
import BubbleChart from './BubbleChart.vue';
import PieChart from './PieChart.vue';


const router = useRouter();
const route = useRoute();

const isActive = (path) => {
  return route.path === path;
};

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

const navigateToSources = () => {
  router.push('/sources');
};

const navigateToInitiatives = () => {
  router.push('/initiatives');
};

const navigateToContact = () => {
  router.push('/contact');
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
.background-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #79bde9;
    background-color: #fafafa;
    background-image: url('https://s8kvb6qnle.execute-api.us-west-2.amazonaws.com/?hash=57e2f2c6f8c556e8de9634c71a03601a&url=https://www.sandiego.edu/admission-and-aid/undergraduate/images/campus-beauty.jpg&width=2100&webp=true');
    opacity: 0.87; 
    z-index: -1000;
    pointer-events: none;
}

.dashboard-container {
    position: relative;  /* <-- make sure content is "positioned" */
    z-index: 0;          /* <-- sits above the background */
}

.main-content {
    width: 100%;
    max-width: 1400px;  
    margin: 0 auto;      /* centers it */
    padding: 20px;       
    box-sizing: border-box;
    flex: 1;
    display: flex;
}

.nav-menu {
  background-color: #003b70;
  height: 71px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px; /* zero vertical padding, 20px left-right */
  box-sizing: border-box;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 30px;
  height: 100%;
  width: 100%;
  padding-right: 60px;
}

.nav-items {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
  height: 100%;
}

.logout-btn {
  margin-left: auto; 
  background-color: transparent;
  color: #ffffff;
  font: 400 14px Inter, sans-serif;
  border: 1px solid #ffffff;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logo-img {
  height: 50px;
}

.navLi {
    display: flex;
    align-items: center;
    height: 100%;
    position: relative;
}

.navLink {
    color: white;
    text-decoration: none;
    font-weight: 600;
    padding: 0 20px; /* horizontal padding only */
    display: flex;
    align-items: center;
    height: 100%;
}

.navLink.active {
    background: rgba(0, 0, 0, 0.15);
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.2);
}

.navLink:hover {
  background: rgba(0, 0, 0, 0.10);
}

.logout-btn:hover {
  background-color: #ffffff;
  color: #003b70;
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
</style>