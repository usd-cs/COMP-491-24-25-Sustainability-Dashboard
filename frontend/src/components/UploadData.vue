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
        <h1 class="title">Office of Sustainability - Energy Dashboard</h1>
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
              accept=".xlsx"
              @change="handleFileSelect"
            />
            <p class="file-format-info">
              Importing requires Microsoft Excel .xlsx
            </p>
          </div>
        </div>

        <div class="action-buttons">
          <button class="cancel-btn" @click="handleCancel" tabindex="0">Cancel</button>
          <button type="submit" class="import-btn">Import</button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const selectedFile = ref(null);

const handleUpload = async (_event) => {
  if (!selectedFile.value) {
    alert('Please select a file to upload.');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1].name);
  }

  try {
    console.log('Making POST request to upload file...');
    console.log('FormData:', formData);

    const response = await axios.post('http://localhost:3000/api/auth/file-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Response:', response);

    if (response.status === 200) {
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
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      alert('Invalid file type. Please upload an .xlsx file.');
      return;
    }
    selectedFile.value = file;
    console.log('File dropped:', selectedFile.value.name);
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    alert('Invalid file type. Please upload an .xlsx file.');
    return;
  }
  selectedFile.value = file;
  console.log('File selected:', selectedFile.value.name);
};

const handleCancel = () => {
  router.push('/main');
};

const handleLogout = () => {
  router.push('/');
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

.upload-portal {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  overflow: hidden;
}

.header {
  background-color: #003b70; /* Official USD Dark blue background for consistency */
  display: flex;
  align-items: center;
  justify-content: space-between; /* Space between title/logo and logout button */
  padding: 20px 40px;
  box-sizing: border-box;
  width: 100%;
}

.header-content {
  display: flex;
  flex-direction: column; /* Stack logo and title vertically */
  align-items: flex-start; /* Align content to the left */
}

.logo {
  height: 60px;
  margin-bottom: 10px; /* Add spacing between the logo and the title */
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.5;
  text-align: left;
}

.user-section {
  display: flex;
  align-items: center;
}

.logout-btn {
  background-color: transparent;
  color: #ffffff;
  font: 400 16px Inter, sans-serif;
  border: 1px solid #ffffff;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #ffffff;
  color: #003b70;
}


.upload-section {
  background-color: #f4f4f4; /* Light gray background for the upload section */
  width: 100%;
  max-width: 700px;
  margin: 40px auto 0;
  padding: 30px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
