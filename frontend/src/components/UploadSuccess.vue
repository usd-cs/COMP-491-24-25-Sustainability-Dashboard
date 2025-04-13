<template>
  <div class="dashboard-container">
    <!-- Header Bar -->
    <header class="nav-menu">
      <div class="nav-content">
        <div class="logo">
          <a href="https://www.sandiego.edu/" target="_blank" rel="noopener noreferrer">
            <img src="https://www.sandiego.edu/brand/images/logos/master-secondary/usd-logo-secondary-2c-reversed.png" alt="USD Logo" class="logo-img" />
          </a>
        </div>
        <ul class="nav-items">
          <li class="navLi"><router-link to="/main" class="navLink" active-class="active">Summary</router-link></li>
          <li class="navLi"><router-link to="/sources" class="navLink" active-class="active">Sources</router-link></li>
          <li class="navLi"><router-link to="/initiatives" class="navLink" active-class="active">Initiatives</router-link></li>
          <li class="navLi"><router-link to="/contact" class="navLink" active-class="active">Contact</router-link></li>
          <li class="navLi"><router-link to="/select" class="navLink" active-class="active">Upload</router-link></li>
        </ul>
        <button class="logout-btn" @click="handleLogout">Logout →</button>
      </div>
    </header>

    <!-- Success Message Content -->
    <main class="upload-success-section">
      <h2 class="upload-success-title">Import Files</h2>
      <div class="separator"></div>
      <section class="success-message-container">
        <div class="success-content">
          <h3 class="success-heading">SUCCESS</h3>
          <p class="success-detail">Imported file successfully</p>
          <p class="success-prompt">Would you like to import more files?</p>
          <p v-if="timestamp" class="timestamp">Imported at: {{ timestamp }}</p>
          <div class="action-buttons">
            <button class="cancel-btn" @click="navigateToMainPage">Cancel</button>
            <button class="import-btn" @click="navigateToImportPage">Import</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const timestamp = ref(null);

// Function to handle file import and set timestamp
const handleFileImport = () => {
  const now = new Date();
  timestamp.value = now.toLocaleString(); // Set the timestamp to the current date and time
};

const navigateToMainPage = () => {
  router.push('/main');
};

const navigateToImportPage = () => {
  router.push('/upload');
};

const handleLogout = () => {
  router.push('/');
};

// Simulate file import action (You can call handleFileImport when actual import occurs)
handleFileImport();
</script>

<style scoped>
/* Reuse some styles from main page for consistency */
.dashboard-container {
  background-color: #ffffff;
  min-height: 100vh;
}

.nav-menu {
  background-color: #003b70;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-content {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.logo-img {
  height: 60px;
}

.nav-items {
  display: flex;
  gap: 24px;
  list-style: none;
}

.navLi {
  font: 500 16px Inter, sans-serif;
}

.navLink {
  color: #ffffff;
  text-decoration: none;
}

.navLink:hover,
.active {
  text-decoration: underline;
}

.logout-btn {
  background: transparent;
  border: 1px solid #ffffff;
  padding: 8px 16px;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #ffffff;
  color: #003b70;
}

.upload-success-section {
  background-color: #f4f4f4;
  max-width: 700px;
  margin: 60px auto;
  padding: 30px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.upload-success-title {
  font: 700 20px Inter, sans-serif;
  color: #003b70;
  text-align: center;
  margin-bottom: 20px;
}

.separator {
  background-color: #003b70;
  height: 2px;
  margin-bottom: 20px;
}

.success-message-container {
  background: #C4E8B7;
  padding: 50px 20px;
  border-radius: 8px;
  text-align: center;
}

.success-heading {
  color: #07700C;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 10px;
}

.success-detail {
  color: #415E37;
  font-size: 16px;
  margin-bottom: 10px;
}

.success-prompt {
  color: #000;
  font-size: 16px;
  margin-bottom: 20px;
}

.timestamp {
  color: #07700C;
  font-size: 16px;
  margin-top: 10px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.cancel-btn,
.import-btn {
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #ffffff;
  color: #003b70;
  border: 2px solid #003b70;
}

.cancel-btn:hover {
  background: #003b70;
  color: #ffffff;
}

.import-btn {
  background: #003b70;
  color: #ffffff;
  border: none;
}

.import-btn:hover {
  background: #0056a4;
}

@media (max-width: 768px) {
  .nav-items {
    flex-direction: column;
    gap: 10px;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
