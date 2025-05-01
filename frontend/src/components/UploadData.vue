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
              <!-- Athena-specific instructions -->
              <div v-if="selectedSource === 'Athena'" class="athena-settings">
                <h3>Athena File Settings:</h3>
                <ol>
                  <li>Navigate to <strong>“all_meters_1_week_hourly”</strong> to edit</li>
                  <li>Export As Data (<strong>.csv</strong>)</li>
                  <li>Set to desired reporting range</li>
                  <li>Check:
                    <ul>
                      <li>Combine Result Rows Into A Single Table</li>
                      <li>Combine Results Into One Row Per Timestamp</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <!-- Bloom-specific instructions -->
              <div v-if="selectedSource === 'Bloom'" class="source-settings">
                <h3>Bloom File Settings:</h3>
                <ol>
                  <li>Reports &gt; Data Extract</li>
                  <li>Time Interval: Select <strong>Daily</strong></li>
                  <li>Timeframe: Select desired timeframe</li>
                </ol>
              </div>
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

.athena-settings {
  margin-top: 20px;
  padding: 15px;
  background-color: #e8f1fa;
  border-left: 4px solid #003b70;
  color: #003b70;
}

.athena-settings h3 {
  margin-bottom: 10px;
  font-size: 16px;
}

.source-settings {
  margin-top: 20px;
  padding: 15px;
  background-color: #e8f1fa;
  border-left: 4px solid #003b70;
  color: #003b70;
}

.source-settings h3 {
  margin-bottom: 10px;
  font-size: 16px;
}

.upload-portal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.upload-section {
  background-color: #f4f4f4; /* Light gray background for the upload section */
  width: 100%;
  max-width: 700px;
  margin: 25px;
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
.import-btn {
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