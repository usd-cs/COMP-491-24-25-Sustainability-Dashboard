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


<script setup>
import { useRouter } from 'vue-router';
import AppLayout from './AppLayout.vue';
/**
 * @file UploadSuccess.vue
 * @description Component to display a success message after a file is successfully uploaded.
 */
 const router = useRouter();

/**
 * Navigates to the main dashboard page.
 */
const navigateToMainPage = () => {
  router.push('/');
};

/**
 * Navigates to the file upload page.
 */
const navigateToImportPage = () => {
  router.push('/upload');
};

// Simulate file import action (You can call handleFileImport when actual import occurs)
</script>

<style scoped>
.upload-success-portal {
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-success-section {
  background-color: #f4f4f4;
  margin: 60px auto;
  width: 900px;
  padding: 30px 20px;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
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
</style>
