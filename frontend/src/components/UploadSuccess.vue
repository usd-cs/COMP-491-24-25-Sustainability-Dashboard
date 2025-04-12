<template>
  <AppLayout>
    <div class="upload-success-portal">
      <main class="upload-success-section">
        <h2 class="upload-success-title">Import Files</h2>
        <div class="separator"></div>
        <section class="success-message-container">
          <div class="success-content">
            <h3 class="success-heading">SUCCESS</h3>
            <p class="success-detail">Imported file successfully</p>
            <p class="success-prompt">Would you like to import more files?</p>
            <div class="action-buttons">
              <button class="cancel-btn" @click="navigateToMainPage" tabindex="0">Cancel</button>
              <button class="import-btn" @click="navigateToImportPage" tabindex="0">Import</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  </AppLayout>
</template>


<script>
import AppLayout from './AppLayout.vue';

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
  },
};
</script>

<style scoped>
.upload-success-portal {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 71px;
  overflow: hidden;
}

.upload-success-section {
  background-color: #f4f4f4; /* Light gray background */
  width: 100%;
  max-width: 700px;
  margin: 40px auto 0;
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
  width: 100%;
  margin-bottom: 20px;
}

.success-message-container {
  background: #C4E8B7;
  margin: 35px auto 0;
  width: 100%;
  max-width: 500px;
  padding: 50px 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.action-buttons {
  display: flex;
  gap: 20px;
}

.cancel-btn {
  background: #ffffff;
  color: #003b70;
  font-size: 16px;
  padding: 10px 20px;
  border: 2px solid #003b70;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #003b70;
  color: #ffffff;
}

.import-btn {
  background: #003b70;
  color: #ffffff;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.import-btn:hover {
  background: #0056a4;
}

@media (max-width: 991px) {
  .header {
    padding: 10px 20px;
  }

  .upload-success-section {
    padding: 20px;
  }

  .success-message-container {
    padding: 40px 15px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
}
</style>