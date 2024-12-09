<template>
    <div class="upload-portal">
      <header class="header">
        <h1 class="title">USD Office of Sustainability</h1>
        <div class="user-section">
          <p class="greeting">Hi, John</p>
          <div class="user-controls">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/791c4a8e0c7133ecf28f725d1108e1683b876684029d5716478d6609cf0d03e4?placeholderIfAbsent=true&apiKey=f29b03ba12534ec591c5dc75765cc341"
              class="user-avatar"
              alt="User profile"
            />
            <button class="logout-btn" @click="handleLogout" tabindex="0">Logout</button>
            <div class="notification-icons">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a69ad925a47626e860b9390313683b00c1394925e3d2a71d935a472190d93c5d?placeholderIfAbsent=true&apiKey=f29b03ba12534ec591c5dc75765cc341"
                class="notification-icon"
                alt=""
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a69ad925a47626e860b9390313683b00c1394925e3d2a71d935a472190d93c5d?placeholderIfAbsent=true&apiKey=f29b03ba12534ec591c5dc75765cc341"
                class="notification-icon"
                alt=""
              />
            </div>
          </div>
        </div>
      </header>
  
      <main class="upload-section">
        <h2 class="upload-title">Import Files</h2>
        <div class="separator"></div>
        
        <form @submit.prevent="handleUpload" class="upload-form">
          <div class="dropzone" 
               @dragover.prevent 
               @drop.prevent="handleFileDrop"
               tabindex="0"
               role="button"
               aria-label="Drop zone for file upload">
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
                accept=".xlsx,.csv"
                @change="handleFileSelect"
              />
              <p class="file-format-info">
                Importing requires Microsoft Excel .xlsx or .csv format
              </p>
            </div>
          </div>
  
          <div class="action-buttons">
            <button 
              type="button" 
              class="cancel-btn" 
              @click="handleCancel">
              Cancel
            </button>
            <button 
              type="submit" 
              class="import-btn">
              Import
            </button>
          </div>
        </form>
      </main>
    </div>
  </template>
  
  <script setup>
  const handleUpload = (event) => {
    // Handle form submission
  }
  
  const handleFileDrop = (event) => {
    // Handle file drop
  }
  
  const handleFileSelect = (event) => {
    // Handle file selection
  }
  
  const handleCancel = () => {
    // Handle cancel action
  }
  
  const handleLogout = () => {
    // Handle logout action
  }
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
    color: #000;
    font: 400 18px Inter, sans-serif;
    background: none;
    border: none;
    cursor: pointer;
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