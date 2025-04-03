<template>
    <main class="landing-page">
      <section class="landing-container">
        <div class="content-wrapper">
          <!-- Filter Tabs Section -->
          <nav class="filter-section">
            <div class="filter-tabs">
              <button class="filter-tab">All</button>
              <button class="filter-tab">Electricity</button>
              <button class="filter-tab">Fuel Cell</button>
              <button class="filter-tab active">Solar</button>
            </div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/651ae0fe630c4b948afc8107075832b0/43e3cd38dc63affb80913c1436acf9f7004438d5?placeholderIfAbsent=true"
              alt="Filter illustration"
              class="filter-image"
            />
          </nav>
  
          <!-- Building Grid Section -->
          <section class="grid-container">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/651ae0fe630c4b948afc8107075832b0/8a775e1fcf0c8925b4192ca215071428b41b5f40?placeholderIfAbsent=true"
              alt="Buildings overview"
              class="overview-image"
            />
            <div class="building-grid">
              <div class="grid-row">
                <article class="building-card">
                  <h2 class="building-name">Alcala Borrego</h2>
                </article>
                <article class="building-card">
                  <h2 class="building-name">Alcala Laguna</h2>
                </article>
                <article class="building-card">
                  <h2 class="building-name">Camino Hall</h2>
                </article>
                <article class="building-card">
                  <h2 class="building-name">Copley Library</h2>
                </article>
              </div>
              <div class="grid-row">
                <article class="building-card">
                  <h2 class="building-name">Founders Hall</h2>
                </article>
                <article class="building-card">
                  <h2 class="building-name">Jenny Craig Pavilion</h2>
                </article>
                <article class="building-card">
                  <h2 class="building-name">Kroc</h2>
                </article>
                <article class="building-card">
                  <h2 class="building-name">Manchester A</h2>
                </article>
              </div>
              <div class="grid-row">
                <article class="building-card">
                  <h2 class="building-name">Manchester B</h2>
                </article>
                <article class="building-card">
                  <h2 class="building-name">Soles</h2>
                </article>
                <article class="building-card">
                  <h2 class="building-name">West Parking</h2>
                </article>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  </template>
  
  <script>
  export default {
    name: "AthenaLandingPage",
  };
  </script>
  
  <style scoped>
  .landing-page {
    background-color: #fff;
    display: flex;
    padding-bottom: 36px;
    flex-direction: column;
    overflow: hidden;
    align-items: stretch;
  }
  
  .landing-container {
    background-color: #003b6f;
    align-self: center;
    display: flex;
    margin-top: 22px;
    width: 100%;
    max-width: 1384px;
    padding: 23px;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
  }
  
  .content-wrapper {
    background-color: #fff;
    padding: 26px;
  }
  
  /* Filter Tabs Styles */
  .filter-section {
    display: flex;
    margin-left: 59px;
    width: 404px;
    max-width: 100%;
    flex-direction: column;
    font-family:
      Inter,
      -apple-system,
      Roboto,
      Helvetica,
      sans-serif;
    font-size: 20px;
    color: #000;
  }
  
  .filter-tabs {
    align-self: start;
    display: flex;
    align-items: stretch;
    gap: 39px;
  }
  
  .filter-tab {
    background: none;
    border: none;
    font-size: 20px;
    color: #000;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
  }
  
  .filter-tab.active {
    font-weight: 700;
  }
  
  .filter-image {
    object-fit: contain;
    object-position: center;
    width: 90px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    align-self: end;
  }
  
  /* Building Grid Styles */
  .grid-container {
    width: 100%;
    padding: 0 52px;
  }
  
  .overview-image {
    object-fit: contain;
    object-position: center;
    width: 100%;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  
  .building-grid {
    margin-top: 32px;
  }
  
  .grid-row {
    gap: 20px;
    display: flex;
    margin-bottom: 24px;
  }
  
  .grid-row:last-child {
    width: 934px;
    max-width: 100%;
  }
  
  /* Building Card Styles */
  .building-card {
    background-color: #003b6f;
    flex: 1;
    padding: 26px 20px;
    min-height: 200px;
    width: 100%;
  }
  
  .building-name {
    font-family:
      Inter,
      -apple-system,
      Roboto,
      Helvetica,
      sans-serif;
    font-size: 22px;
    color: #fff;
    font-weight: 700;
    margin: 0;
  }
  
  /* Media Queries */
  @media (max-width: 991px) {
    .landing-container {
      max-width: 100%;
      padding-right: 20px;
    }
  
    .content-wrapper {
      max-width: 100%;
    }
  
    .filter-section {
      margin-left: 10px;
    }
  
    .grid-container {
      max-width: 100%;
      padding: 0 20px;
    }
  
    .overview-image {
      max-width: 100%;
    }
  
    .grid-row {
      flex-direction: column;
      align-items: stretch;
      gap: 0;
    }
  
    .building-card {
      margin-top: 17px;
      padding: 20px;
      min-height: 150px;
    }
  }
  </style>
  