<template>
  <!-- Main container for the Upload Success page -->
  <div class="upload-success-container">
    <!-- Header section with title and logout functionality -->
    <header class="header">
      <h1 class="title">USD Office of <br />Sustainability</h1>
      <div class="user-section">
        <div class="user-controls">
          <button class="logout-btn" @click="handleLogout" tabindex="0">
            Logout →
          </button>
        </div>
      </div>
    </header>

    <!-- Main content section -->
    <main class="main-content">
      <h2 class="section-title">Import Files</h2>
      <div class="divider"></div>
      <!-- Success message container -->
      <section class="success-message-container">
        <div class="success-content">
          <h3 class="success-heading">SUCCESS</h3>
          <p class="success-detail">Imported file successfully</p>
          <p class="success-prompt">Would you like to import more files?</p>
          <div class="action-buttons">
            <!-- Cancel and Import buttons -->
            <button class="cancel-btn" @click="navigateToMainPage" tabindex="0">Cancel</button>
            <button class="import-btn" @click="navigateToImportPage" tabindex="0">Import</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
/**
 * @file UploadSuccess.vue
 * @description Component to display a success message after a file is successfully uploaded.
 */
export default {
  methods: {
    /**
     * Navigates to the main dashboard page.
     */
    navigateToMainPage() {
      this.$router.push('/main');
    },
    /**
     * Navigates to the file upload page.
     */
    navigateToImportPage() {
      this.$router.push('/upload');
    },
    /**
     * Logs out the user and navigates to the login page.
     */
    handleLogout() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
/* General container for the Upload Success page */
.upload-success-container {
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 152px;
}

/* Header styling */
.header {
  background: #00B1E2;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  padding: 37px 28px;
  width: 100%;
}

.title {
  color: #fff;
  font: 400 40px Inter, sans-serif;
  margin: 0;
}

/* User section in the header */
.user-section {
  display: flex;
  gap: 31px;
  margin: auto 0;
}

.greeting {
  color: #fff;
  font: 400 18px Inter, sans-serif;
  margin: auto 0;
}

.user-controls {
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 15px;
  padding: 11px 4px 11px 10px;
}

.user-avatar {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

/* Updated logout-btn styling from Upload Data file */
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

/* Notification icons */
.notification-icons {
  display: flex;
  flex-direction: column;
  align-self: start;
  width: 21px;
  margin-top: 4px;
}

.notification-icon {
  width: 100%;
  object-fit: contain;
}

/* Main content styles */
.main-content {
  background: #D9D9D9;
  margin: 87px auto 0;
  width: 100%;
  max-width: 1067px;
  padding: 10px 1px 62px;
  font-family: Inter, sans-serif;
}

/* Success message section */
.success-message-container {
  background: #C4E8B7;
  margin: 35px auto 0;
  width: 730px;
  max-width: 100%;
  padding: 155px 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.success-content {
  display: flex;
  flex-direction: column;
  width: 269px;
  max-width: 100%;
}

.success-heading {
  color: #07700C;
  font-size: 48px;
  font-weight: 800;
  margin: 0 18px;
}

.success-detail {
  color: #415E37;
  font-size: 16px;
  margin: 0 26px;
}

.success-prompt {
  color: #000;
  font-size: 16px;
  margin-top: 21px;
}

/* Action buttons for cancel and import */
.action-buttons {
  display: flex;
  gap: 19px;
  margin-top: 16px;
  width: 233px;
  max-width: 100%;
  align-self: center;
}

.cancel-btn {
  background: #fff;
  color: #00B1E2;
  font-size: 18px;
  padding: 14px 23px;
  border: none;
  cursor: pointer;
}

.import-btn {
  background: #00B1E2;
  color: #fff;
  font-size: 20px;
  padding: 11px 23px;
  border: none;
  cursor: pointer;
}

.section-title {
  color: black;
}

/* Responsive styles */
@media (max-width: 991px) {
  .upload-success-container {
    padding-bottom: 100px;
  }

  .header {
    padding: 0 20px;
  }

  .main-content {
    margin-top: 40px;
  }

  .section-title {
    margin-left: 8px;
  }

  .success-message-container {
    padding: 100px 20px;
  }

  .success-heading {
    font-size: 40px;
  }

  .action-buttons {
    white-space: initial;
  }

  .cancel-btn,
  .import-btn {
    padding: 0 20px;
  }
}
</style>
