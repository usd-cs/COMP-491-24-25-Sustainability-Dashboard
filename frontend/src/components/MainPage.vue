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
      <div class="content-grid">
        <!-- Sidebar with navigation items -->
        <aside class="sidebar">
          <div class="sidebar-content">
            <h2 class="sidebar-title">FUTURE NAVIGATION SIDEBAR</h2>
            <nav class="navigation-menu">
              <!-- Navigation items for future use -->
              <div class="nav-item" tabindex="0" role="button" @click="navigateToBarChart">Bar Chart</div>
              <div class="nav-item" tabindex="0" role="button"></div>
              <div class="nav-item" tabindex="0" role="button"></div>
              <div class="nav-item" tabindex="0" role="button"></div>
            </nav>
            <!-- Button to navigate to the upload data page -->
            <button class="upload-button" @click="navigateToUpload" tabindex="0">Upload Data</button>
          </div>
        </aside>

        <!-- Placeholder for dashboard visuals -->
        <section class="dashboard-content">
          <h2 class="dashboard-title">FUTURE DASHBOARD VISUALS</h2>
          <div>
            <BarChart/>
            <BubbleChart/>
          </div>
        </section>
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

const router = useRouter(); // Vue Router instance for programmatic navigation

/**
 * Navigate to the data upload page.
 * Triggered when the "Upload Data" button in the sidebar is clicked.
 */
const navigateToUpload = () => {
  router.push('/upload');
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
  router.push('/bar-chart'); // Replace '/bar-chart' with your actual route for the Bar Chart page
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
  padding-bottom: 31px;
  flex-direction: column;
  overflow-y: hidden;
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
  height: 60px;
  margin-bottom: 10px; /* Add spacing between the logo and the title */
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.5;
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
  align-self: center;
  margin-top: 27px;
  width: 100%;
  max-width: 1384px;
}

/* Grid layout for content */
.content-grid {
  display: flex;
  gap: 20px;
}

/* Sidebar styles */
.sidebar {
  display: flex;
  flex-direction: column;
  width: 15%;
}

.sidebar-content {
  background: #D9D9D9;
  display: flex;
  flex-direction: column;
  padding: 29px 18px;
  font: 400 16px Inter, sans-serif;
  color: #000;
}

.sidebar-title {
  font-size: 24px;
  margin: 0;
}

.navigation-menu {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 23px;
}

.nav-item {
  background: #fff;
  height: 52px;
  cursor: pointer;
}

.upload-button {
  background: #fff;
  margin-top: 293px;
  font-size: 20px;
  padding: 17px 24px;
  border: none;
  cursor: pointer;
}

/* Dashboard content styles */
.dashboard-content {
  display: flex;
  flex-direction: column;
  width: 85%;
}

.dashboard-title {
  background: #D9D9D9;
  color: #000;
  width: 100%;
  padding: 181px 70px 424px;
  font: 400 64px Inter, sans-serif;
  margin: 0;
}
</style>
