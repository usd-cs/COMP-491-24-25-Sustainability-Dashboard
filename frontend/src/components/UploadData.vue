<template>
  <div class="upload-portal">
    <header class="header">
      <h1 class="title">USD Office of Sustainability</h1>
      <div class="user-section">
        <div class="user-controls">
          <button class="logout-btn" @click="handleLogout" tabindex="0">
            Logout →
          </button>
        </div>
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

const handleUpload = async (event) => {
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
  background-color: #fff;
  display: flex;
  padding-bottom: 152px;
  flex-direction: column;
  overflow: hidden;
}

.header {
  background-color: #00B1E2;
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 37px 28px;
}

.title {
  color: #fff;
  font: 400 40px Inter, sans-serif;
  margin: 0;
}

.user-section {
  display: flex;
  gap: 31px;
  align-items: center;
}

.greeting {
  color: #fff;
  font: 400 18px Inter, sans-serif;
  margin: 0;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 11px 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
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

.notification-icons {
  display: flex;
  gap: 5px;
}

.notification-icon {
  width: 21px;
  height: 18px;
  object-fit: contain;
}

.upload-section {
  background-color: #D9D9D9;
  width: 100%;
  max-width: 1067px;
  margin: 87px auto 0;
  padding: 10px 1px 22px;
}

.upload-title {
  color: #000;
  font: 400 24px Inter, sans-serif;
  margin: 0 0 16px 8px;
}

.separator {
  background-color: #1E1E1E;
  height: 1px;
  width: 100%;
}

.upload-form {
  margin-top: 28px;
}

.dropzone {
  background-color: #D9D9D9;
  width: 963px;
  max-width: 100%;
  margin: 0 auto;
  padding: 102px 80px;
  border: 1px dashed #000;
  cursor: pointer;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 404px;
  margin: 0 auto;
}

.dropzone-text {
  font: 400 20px Inter, sans-serif;
  color: black;
  text-align: center;
  margin: 0;
}

.select-files-btn {
  background-color: #fff;
  color: #00B1E2;
  padding: 9px;
  margin-top: 28px;
  width: 100px;
  text-align: center;
  cursor: pointer;
}

.file-format-info {
  font: 400 16px Inter, sans-serif;
  color: black;
  margin-top: 48px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  max-width: 955px;
  margin: 30px auto 0;
  padding: 0 20px;
}

.cancel-btn {
  background-color: #fff;
  color: #00B1E2;
  font: 400 18px Inter, sans-serif;
  padding: 9px 20px;
  border: none;
  cursor: pointer;
}

.import-btn {
  background-color: #00B1E2;
  color: #fff;
  font: 400 20px Inter, sans-serif;
  padding: 11px 21px;
  border: none;
  cursor: pointer;
}

@media (max-width: 991px) {
  .upload-portal {
    padding-bottom: 100px;
  }

  .header {
    padding: 0 20px;
  }

  .upload-section {
    margin-top: 40px;
  }

  .dropzone {
    padding: 100px 20px;
  }

  .file-format-info {
    margin-top: 40px;
  }
}
</style>
