<template>
    <div class="background-pattern"></div>
    <div class="dashboard-container">
      <!-- New Navigation Bar -->
      <header class="nav-menu">
        <div class="nav-content">
          <div class="logo">
            <a href="https://www.sandiego.edu/" target="_blank" rel="noopener noreferrer">
              <img src="https://www.sandiego.edu/brand/images/logos/master-secondary/usd-logo-secondary-2c-reversed.png" alt="USD Logo" class="logo-img">
            </a>
          </div>
          <ul class="nav-items">
            <li class="navLi"><router-link to="/main" class="navLink" active-class="active" @click.prevent="navigateToMain">Summary</router-link></li>
            <li class="navLi"><router-link to="/sources" class="navLink" active-class="active" @click.prevent="navigateToSources">Sources</router-link></li>
            <li class="navLi"><router-link to="/initiatives" class="navLink" active-class="active" @click.prevent="navigateToInitiatives">Initiatives</router-link></li>
            <li class="navLi"><router-link to="/contact" class="navLink" active-class="active" @click.prevent="navigateToContact">Contact</router-link></li>
          </ul>
          <!-- Logout button -->
          <button class="logout-btn" @click="handleLogout" tabindex="0">Logout →</button>
        </div>
      </header>
  
      <!-- Main content area -->
      <main class="sources__content">
        <section class="sources__panel">
          <div class="sources__panel-inner">
            <nav class="sources__filters">
              <button
                v-for="filter in filters"
                :key="filter"
                @click="activeFilter = filter"
                :class="['sources__filter-btn', activeFilter === filter ? 'sources__filter-btn--active' : '']"
              >
                {{
                  filter === "all"
                    ? "All"
                    : filter.charAt(0).toUpperCase() + filter.slice(1)
                }}
              </button>
            </nav>
  
            <section class="sources__buildings-grid">
              <article
                v-for="building in filteredBuildings"
                :key="building.name"
                class="sources__building-card"
              >
                <h3 class="sources__building-name">{{ building.name }}</h3>
                <p class="sources__building-type">Type: {{ building.type }}</p>
              </article>
            </section>
          </div>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  const activeFilter = ref("all");
  const filters = ["all", "electricity", "fuelcell", "solar"];
  
  const buildings = [
    { name: "Alcala Borrego", type: "electricity" },
    { name: "Alcala Laguna", type: "electricity" },
    { name: "Camino Hall", type: "solar" },
    { name: "Copley Library", type: "electricity" },
    { name: "Founders Hall", type: "solar" },
    { name: "Jenny Craig Pavilion", type: "electricity" },
    { name: "Kroc", type: "fuelcell" },
    { name: "Manchester A", type: "electricity" },
    { name: "Manchester B", type: "solar" },
    { name: "Soles", type: "electricity" },
    { name: "West Parking - Solar", type: "solar" },
    { name: "West Parking - Fuel Cell", type: "fuelcell" },
  ];
  
  const navigateToMain = () => {
    router.push('/main');
  };
  
  const navigateToSources = () => {
    router.push('/sources');
  };
  
  const navigateToInitiatives = () => {
    router.push('/initiatives');
  };
  
  const navigateToContact = () => {
    router.push('/contact');
  };
  
  const filteredBuildings = computed(() => {
    return activeFilter.value === "all"
      ? buildings
      : buildings.filter((b) => b.type === activeFilter.value);
  });
  
  const handleLogout = () => {
    router.push("/");
  };
  </script>
  
  <style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Inter&display=swap");
  
  /* Reset styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .background-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #79bde9;
    opacity: 0.87;
    z-index: -1000;
    pointer-events: none;
  }
  
  /* Navigation Styles */
  .nav-menu {
    background-color: #003b70;
    height: 71px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 20px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  }
  
  .nav-content {
    display: flex;
    align-items: center;
    gap: 30px;
    width: 100%;
    padding-right: 60px;
  }
  
  .nav-items {
    list-style: none;
    display: flex;
    gap: 20px;
  }
  
  .logo-img {
    height: 50px;
  }
  
  .navLi {
    display: flex;
    align-items: center;
    height: 100%;
  }
  
  .navLink {
    color: white;
    text-decoration: none;
    font-weight: 600;
    padding: 0 20px;
    display: flex;
    align-items: center;
    height: 100%;
  }
  
  .navLink.active {
    background: rgba(0, 0, 0, 0.15);
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.2);
  }
  
  .navLink:hover {
    background: rgba(0, 0, 0, 0.10);
  }
  
  .logout-btn {
    margin-left: auto;
    background-color: transparent;
    color: #ffffff;
    font: 400 14px Inter, sans-serif;
    border: 1px solid #ffffff;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .logout-btn:hover {
    background-color: #ffffff;
    color: #003b70;
  }
  
  /* Sources Content */
  .sources__content {
    padding: 24px;
  }
  
  .sources__panel {
    background-color: #003b70;
    padding: 24px;
    border-radius: 4px;
  }
  
  .sources__panel-inner {
    background-color: white;
    padding: 24px;
    border-radius: 4px;
  }
  
  .sources__filters {
    display: flex;
    gap: 32px;
    align-items: center;
    border-bottom: 2px solid #6c6c6c;
    padding-bottom: 12px;
    margin-bottom: 24px;
  }
  
  .sources__filter-btn {
    font-size: 20px;
    color: #003b70;
    cursor: pointer;
    background: none;
    border: none;
  }
  
  .sources__filter-btn--active {
    font-weight: bold;
  }
  
  .sources__buildings-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  
  .sources__building-card {
    background-color: white;
    padding: 16px;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .sources__building-name {
    font-size: 18px;
    font-weight: 600;
    color: #003b70;
  }
  
  @media (max-width: 991px) {
    .sources__buildings-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  </style>
  