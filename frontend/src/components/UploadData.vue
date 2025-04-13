<template>
  <div class="upload-portal">
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

    <main class="upload-section">
      <h2 class="upload-title">Import Files</h2>
      <div class="separator"></div>

      <form @submit.prevent="handleUpload" class="upload-form">
        <div
          class="dropzone"
          @dragover.prevent
          @drop.prevent="handleFileDrop"
          tabindex="0"
          role="button"
          aria-label="Drop zone for file upload"
        >
          <div class="dropzone-content">
            <p class="dropzone-text">
              Drag and drop files here<br />or
            </p>
            <label for="fileInput" class="select-files-btn" tabindex="0">
              Select files
            </label>
            <input
              type="file"
              id="fileInput"
              class="visually-hidden"
              :accept="acceptedFileType"
              @change="handleFileSelect"
            />
            <p class="file-format-info">
              Importing requires a {{ selectedSource === 'Athena' ? 'CSV' : 'Microsoft Excel (.xlsx)' }} file.
            </p>
          </div>
        </div>
        
        <!-- Display selected file name -->
        <div v-if="uploadedFileName" class="uploaded-file">
          <p>Selected File: <strong>{{ uploadedFileName }}</strong></p>
        </div>

        <div class="action-buttons">
          <button class="cancel-btn" @click="handleCancel" tabindex="0">Cancel</button>
          <button class="cancel-btn" @click="handleBack">Back</button>
          <button type="submit" class="import-btn">Import</button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const selectedFile = ref(null);
const uploadedFileName = ref(''); // Initialize as empty string
const selectedSource = ref(localStorage.getItem("selectedSource") || "Athena");

// Computed property for accepted file type based on selected source
const acceptedFileType = computed(() => {
  return selectedSource.value === 'Athena' ? '.csv' : '.xlsx';
});

// Helper function to validate file based on its extension
const isValidFile = (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  if (selectedSource.value === 'Athena') {
    return extension === 'csv';
  } else {
    return extension === 'xlsx';
  }
};

const handleUpload = async (_event) => {
  if (!selectedFile.value) {
    alert('Please select a file to upload.');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    console.log('Making POST request to upload file...');
    
    // Determine the endpoint based on the selected source
    const endpoint = selectedSource.value === 'Athena' 
      ? 'http://localhost:3000/api/auth/athena-upload'
      : 'http://localhost:3000/api/auth/file-upload';

    console.log(`Using endpoint: ${endpoint}`);
    
    const response = await axios.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Response:', response);

    if (response.status === 200) {
      uploadedFileName.value = selectedFile.value.name;
      router.push('/upload-success');
    }
  } catch (error) {
    console.error('Error during file upload:', error);
    alert('File upload failed. Please try again.');
  }
};

const handleFileDrop = (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    if (!isValidFile(file)) {
      alert(`Invalid file type. Please upload a ${selectedSource.value === 'Athena' ? '.csv' : '.xlsx'} file.`);
      return;
    }
    selectedFile.value = file;
    uploadedFileName.value = file.name; // Set the filename
    console.log('File dropped:', file.name);
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (!isValidFile(file)) {
    alert(`Invalid file type. Please upload a ${selectedSource.value === 'Athena' ? '.csv' : '.xlsx'} file.`);
    return;
  }
  selectedFile.value = file;
  uploadedFileName.value = file.name; // Set the filename
  console.log('File selected:', file.name);
};

const handleCancel = () => {
  router.push('/main');
};

const handleBack = () => {
  router.push('/select');
};

const handleLogout = () => {
  router.push('/');
};
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: Inter, sans-serif;
  background-color: #ffffff;
}

.upload-portal {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  flex-shrink: 0;
  background-color: #003b70;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
  box-sizing: border-box;
  width: 100%;
}

.upload-section {
  flex-grow: 1;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  overflow-y: auto;
  height: 100%;
}

.upload-title {
  font: 700 20px Inter, sans-serif;
  color: #003b70;
  text-align: center;
  margin-bottom: 20px;
}

.separator {
  background-color: #003b70;
  height: 2px;
  width: 100%;
  max-width: 700px;
  margin-bottom: 20px;
}

.upload-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 700px;
}

.dropzone {
  background-color: #ffffff;
  width: 100%;
  padding: 50px 20px;
  border: 2px dashed #003b70;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
}

.dropzone-text, 
.file-format-info {
  color: #003b70;
  padding: 20px;
}

.uploaded-file {
  margin-top: 20px;
  color: #003b70;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 30px;
}

.select-files-btn,
.cancel-btn,
.import-btn,
.logout-btn {
  font: 400 16px Inter, sans-serif;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-files-btn {
  background-color: #003b70;
  color: #ffffff;
}

.select-files-btn:hover {
  background-color: #0056a4;
}

.cancel-btn {
  background-color: #ffffff;
  color: #003b70;
  border: 2px solid #003b70;
}

.cancel-btn:hover {
  background-color: #003b70;
  color: #ffffff;
}

.import-btn {
  background-color: #003b70;
  color: #ffffff;
  border: none;
}

.import-btn:hover {
  background-color: #0056a4;
}

.logout-btn {
  background-color: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
}

.logout-btn:hover {
  background-color: #ffffff;
  color: #003b70;
}

.logo {
  height: 60px;
  margin-bottom: 10px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.5;
  text-align: left;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-section {
  display: flex;
  align-items: center;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 991px) {
  .header {
    padding: 10px 20px;
    flex-direction: column;
    align-items: flex-start;
  }

  .upload-section {
    padding: 20px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
}
</style>