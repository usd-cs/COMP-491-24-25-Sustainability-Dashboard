<template>
  <!-- Main container for the dashboard page -->
  <div class="dashboard-container">
    <!-- Header section with the application title and logout button -->
    <header class="header">
      <h1 class="brand-title">USD Office of <br />Sustainability</h1>
      <div class="user-section">
        <div class="user-controls">
          <!-- Logout button -->
          <div class="dropdown">
  <button class="dropdown-btn">
    Menu
    <span class="dropdown-icon">▼</span>
  </button>
  <div class="dropdown-content">
    <a href="/home">Home</a>
    <a href="/settings">Settings</a>
    <a href="/logout">Logout</a>
  </div>
</div>
        </div>
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
              <div class="nav-item" tabindex="0" role="button"></div>
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

/* Header styles */
.header {
  background: #00B1E2;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 37px 28px;
}

.brand-title {
  color: #fff;
  font: 400 40px Inter, sans-serif;
  margin: 0;
}

/* User section styles */
.user-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Dropdown container */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown button styling */
.dropdown-btn {
  background-color: transparent;
  color: #1E1E1E;
  font: 400 18px Inter, sans-serif;
  border: 1px solid #1E1E1E;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

/* Dropdown content */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #fff;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
  border-radius: 4px;
  overflow: hidden;
}

/* Dropdown content links */
.dropdown-content a {
  color: #1E1E1E;
  padding: 10px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s ease;
  font: 400 16px Inter, sans-serif;
}

/* Hover effect for dropdown links */
.dropdown-content a:hover {
  background-color: #f1f1f1;
}

/* Show dropdown content on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Dropdown icon styling */
.dropdown-icon {
  font-size: 12px;
  margin-left: 5px;
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
