<template>
    <div class="upload-success-container">
      <header class="header">
        <h1 class="title">USD Office of Sustainability</h1>
        <div class="user-section">
          <span class="greeting">Hi, John</span>
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
  
      <main class="main-content">
        <h2 class="section-title">Import Files</h2>
        <div class="divider"></div>
        <section class="success-message-container">
          <div class="success-content">
            <h3 class="success-heading">SUCCESS</h3>
            <p class="success-detail">Imported file successfully</p>
            <p class="success-prompt">Would you like to import more files?</p>
            <div class="action-buttons">
              <button class="cancel-btn" @click="navigateToMainPage"  tabindex="0">Cancel</button>
              <button class="import-btn" @click="navigateToImportPage"  tabindex="0">Import</button>
            </div>
          </div>
        </section>
      </main>
    </div>
</template>
<script>
export default {
  methods: {
    navigateToMainPage() {
      this.$router.push('/main'); 
    },
    navigateToImportPage() {
      this.$router.push('/upload');
    },
    handleLogout() {
      this.$router.push('/');
    }
  }
}
</script>

  
  <style scoped>
  .upload-success-container {
    background: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-bottom: 152px;
  }
  
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
  
  .logout-btn {
    position: relative;
    color: #000;
    font: 400 18px Inter, sans-serif;
    background: none;
    border: none;
    cursor: pointer;
  }
  
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
  
  .main-content {
    background: #D9D9D9;
    margin: 87px auto 0;
    width: 100%;
    max-width: 1067px;
    padding: 10px 1px 62px;
    font-family: Inter, sans-serif;
  }
  
  .section-title {
    color: #000;
    font-size: 24px;
    font-weight: 400;
    margin: 0;
  }
  
  .divider {
    background: #1E1E1E;
    height: 1px;
    margin-top: 10px;
  }
  
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
    margin: 0 0 -34px 11px;
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
  
    .success-content {
      margin-bottom: 10px;
    }
  
    .success-heading {
      font-size: 40px;
      margin: 0 10px;
    }
  
    .success-detail {
      margin: 0 10px;
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