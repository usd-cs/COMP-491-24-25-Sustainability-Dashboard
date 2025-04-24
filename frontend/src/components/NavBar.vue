<template>
    <header class="nav-menu">
      <div class="nav-content">
        <div class="logo">
          <a href="https://www.sandiego.edu/" target="_blank" rel="noopener noreferrer">
            <img src="https://www.sandiego.edu/brand/images/logos/master-secondary/usd-logo-secondary-2c-reversed.png" alt="USD Logo" class="logo-img">
          </a>
        </div>
        <ul class="nav-items">
          <li :class="['navLi', isActive('/main') ? 'active-tab' : '']">
            <router-link to="/main" class="navLink" @click.prevent="navigateToMain">Dashboard</router-link>
          </li>
          <li :class="['navLi', isActive('/sources') ? 'active-tab' : '']">
            <router-link to="/sources" class="navLink" @click.prevent="navigateToSources">Sources</router-link>
          </li>
          <li :class="['navLi', isActive('/initiatives') ? 'active-tab' : '']">
            <router-link to="/initiatives" class="navLink" @click.prevent="navigateToInitiatives">Initiatives</router-link>
          </li>
        </ul>
        <!-- logout button separated -->
        <button class="logout-btn" @click="handleLogout" tabindex="0">Logout →</button>
      </div>
    </header>
</template>


<script setup>
/**
 * @file MainPage.vue
 * @description This Vue component represents the main dashboard page. It includes a header, navigation sidebar, and placeholders for dashboard visuals and data upload functionality.
 */

 /**
  * <li class="navLi"><router-link to="/select" active-class="active" @click.prevent="navigateToSelect">Upload</router-link></li>
  */

import { useRouter, useRoute } from 'vue-router'; // Import Vue Router for navigation

const router = useRouter();
const route = useRoute();

const isActive = (path) => {
  return route.path === path;
};

/**
 * Navigate to the data upload page.
 * Triggered when the "Upload Data" button in the sidebar is clicked.
 */
 const navigateToSelect = () => router.push('/select');

const navigateToMain = () => {
  router.push('/main');
};

const navigateToSources = () => {
  router.push('/sources');
};

const navigateToInitiatives = () => {
  router.push('/initiatives');
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

.active-tab {
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 3px solid #004785;
}

.nav-menu {
    position: fixed; /* Fix the navigation bar at the top */
    top: 0; 
    left: 0; 
    width: 100%; 
    background-color: #003b70;
    height: 71px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 20px;
    box-sizing: border-box;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000; /* stays above other elements */
    border-bottom: 1px solid #43545d;
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
  
</style>