<template>
  <AppLayout>
    <div class="upload-portal">
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
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import AppLayout from './AppLayout.vue';

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

</script>

<style scoped>
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

.uploaded-file {
  margin-top: 20px;
  font: 400 16px Inter, sans-serif;
  color: #003b70;
  text-align: center;
}

.upload-portal {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 71px;
  overflow: hidden;
}

.upload-section {
  background-color: #f4f4f4; /* Light gray background for the upload section */
  width: 100%;
  max-width: 700px;
  margin: 40px auto 0;
  padding: 30px 20px;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
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
  margin-bottom: 20px;
}

.upload-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dropzone {
  background-color: #ffffff;
  width: 100%;
  max-width: 500px;
  padding: 50px 20px;
  border: 2px dashed #003b70;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dropzone-text {
  font: 400 16px Inter, sans-serif;
  color: #003b70;
  margin-bottom: 20px;
}

.select-files-btn {
  background-color: #003b70;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font: 400 16px Inter, sans-serif;
  text-align: center;
}

.select-files-btn:hover {
  background-color: #0056a4;
}

.file-format-info {
  font: 400 14px Inter, sans-serif;
  color: #333333;
  margin-top: 15px;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  margin-top: 30px;
}

.cancel-btn {
  background-color: #ffffff;
  color: #003b70;
  font: 400 16px Inter, sans-serif;
  padding: 10px 20px;
  border: 2px solid #003b70;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #003b70;
  color: #ffffff;
}

.import-btn {
  background-color: #003b70;
  color: #ffffff;
  font: 400 16px Inter, sans-serif;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.import-btn:hover {
  background-color: #0056a4;
}

@media (max-width: 991px) {
  .header {
    padding: 10px 20px;
  }

  .upload-section {
    padding: 20px;
  }

  .dropzone {
    padding: 40px 15px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
