<template>
    <div class="dashboard-container">
      <header class="header">
        <h1 class="brand-title">USD Office of Sustainability</h1>
        <div class="user-section">
          <span class="welcome-text">Hi, John</span>
          <div class="logout-wrapper">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/791c4a8e0c7133ecf28f725d1108e1683b876684029d5716478d6609cf0d03e4?placeholderIfAbsent=true&apiKey=f29b03ba12534ec591c5dc75765cc341"
              class="profile-image"
              alt=""
            />
            <button class="logout-button" tabindex="0">Logout</button>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a69ad925a47626e860b9390313683b00c1394925e3d2a71d935a472190d93c5d?placeholderIfAbsent=true&apiKey=f29b03ba12534ec591c5dc75765cc341"
              class="logout-icon"
              alt=""
            />
          </div>
        </div>
      </header>
      <main class="main-content">
        <div class="content-grid">
          <aside class="sidebar">
            <div class="sidebar-content">
              <h2 class="sidebar-title">FUTURE NAVIGATION SIDEBAR</h2>
              <nav class="navigation-menu">
                <div class="nav-item" tabindex="0" role="button"></div>
                <div class="nav-item" tabindex="0" role="button"></div>
                <div class="nav-item" tabindex="0" role="button"></div>
                <div class="nav-item" tabindex="0" role="button"></div>
              </nav>
              <button class="upload-button" tabindex="0">Upload Data</button>
            </div>
          </aside>
          <section class="dashboard-content">
            <h2 class="dashboard-title">FUTURE DASHBOARD VISUALS</h2>
          </section>
        </div>
      </main>
    </div>
  </template>
  
  <style scoped>
  .dashboard-container {
    background: #fff;
    display: flex;
    padding-bottom: 31px;
    flex-direction: column;
    overflow: hidden;
  }
  
  .header {
    background: #00B1E2;
    display: flex;
    width: 100%;
    gap: 20px;
    font-family: Inter, sans-serif;
    font-weight: 400;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 37px 28px;
  }
  
  .brand-title {
    color: #fff;
    font-size: 40px;
    margin: 0;
  }
  
  .user-section {
    display: flex;
    gap: 31px;
    font-size: 18px;
    margin: auto 0;
  }
  
  .welcome-text {
    color: #fff;
    margin: auto 0;
  }
  
  .logout-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    aspect-ratio: 2.432;
    gap: 15px;
    color: #000;
    white-space: nowrap;
    padding: 11px 4px 11px 10px;
  }
  
  .profile-image {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  .logout-button {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    padding: 0;
  }
  
  .logout-icon {
    aspect-ratio: 1.17;
    object-fit: contain;
    object-position: center;
    width: 21px;
    align-self: start;
    margin-top: 4px;
  }
  
  .main-content {
    align-self: center;
    margin-top: 27px;
    width: 100%;
    max-width: 1384px;
  }
  
  .content-grid {
    gap: 20px;
    display: flex;
  }
  
  .sidebar {
    display: flex;
    flex-direction: column;
    line-height: normal;
    width: 15%;
    margin-left: 0;
  }
  
  .sidebar-content {
    background: #D9D9D9;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    font-family: Inter, sans-serif;
    color: #000;
    font-weight: 400;
    width: 100%;
    padding: 29px 18px;
  }
  
  .sidebar-title {
    font-size: 24px;
    margin: 0;
  }
  
  .navigation-menu {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    gap: 23px;
  }
  
  .nav-item {
    background: #fff;
    height: 52px;
    cursor: pointer;
  }
  
  .upload-button {
    background: #fff;
    margin-top: 293px;
    font-size: 20px;
    padding: 17px 24px;
    border: none;
    cursor: pointer;
  }
  
  .dashboard-content {
    display: flex;
    flex-direction: column;
    line-height: normal;
    width: 85%;
    margin-left: 20px;
  }
  
  .dashboard-title {
    background: #D9D9D9;
    flex-grow: 1;
    color: #000;
    width: 100%;
    padding: 181px 70px 424px;
    font: 400 64px Inter, sans-serif;
    margin: 0;
  }
  
  @media (max-width: 991px) {
    .header {
      max-width: 100%;
      padding: 0 20px;
    }
  
    .logout-wrapper {
      white-space: initial;
    }
  
    .main-content {
      max-width: 100%;
    }
  
    .content-grid {
      flex-direction: column;
      align-items: stretch;
      gap: 0;
    }
  
    .sidebar {
      width: 100%;
    }
  
    .sidebar-content {
      margin-top: 31px;
    }
  
    .sidebar-title {
      margin-left: 8px;
    }
  
    .navigation-menu {
      margin-top: 40px;
    }
  
    .upload-button {
      margin-top: 40px;
      padding: 0 20px;
    }
  
    .dashboard-content {
      width: 100%;
    }
  
    .dashboard-title {
      font-size: 40px;
      max-width: 100%;
      margin-top: 31px;
      padding: 100px 20px;
    }
  }
  </style>