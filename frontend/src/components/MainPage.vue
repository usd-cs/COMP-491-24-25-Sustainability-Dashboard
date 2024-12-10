<template>
  <div class="dashboard-container">
    <header class="header">
      <h1 class="brand-title">USD Office of Sustainability</h1>
      <div class="user-section">
        <div class="user-controls">
          <button class="logout-btn" @click="handleLogout" tabindex="0">
            Logout →
          </button>
        </div>
      </div>
    </header>
    <main class="main-content">
      <div class="content-grid">
        <aside class="sidebar">
          <div class="sidebar-content">
            <h2 class="sidebar-title">FUTURE NAVIGATION SIDEBAR</h2>
            <nav class="navigation-menu">
              <div class="nav-item" tabindex="0" role="button"></div>
              <div class="nav-item" tabindex="0" role="button"></div>
              <div class="nav-item" tabindex="0" role="button"></div>
              <div class="nav-item" tabindex="0" role="button"></div>
            </nav>
            <button class="upload-button" @click="navigateToUpload" tabindex="0">Upload Data</button>
          </div>
        </aside>
        <section class="dashboard-content">
          <h2 class="dashboard-title">FUTURE DASHBOARD VISUALS</h2>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToUpload = () => {
  router.push('/upload');
};

const handleLogout = () => {
  router.push('/');
};
</script>

<style scoped>
/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-container {
  background: #fff;
  display: flex;
  padding-bottom: 31px;
  flex-direction: column;
  overflow-y: hidden;
}

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

.logout-btn {
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

.logout-btn:hover {
  background-color: #1E1E1E;
  color: #fff;
}

.main-content {
  align-self: center;
  margin-top: 27px;
  width: 100%;
  max-width: 1384px;
}

.content-grid {
  display: flex;
  gap: 20px;
}

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
