<template>
    <div class="sources">
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
          <button class="logout-btn" @click="handleLogout">Logout →</button>
        </div>
      </header>
  
      <main class="sources__content">
        <section class="sources__panel">
          <div class="sources__panel-inner">
            <nav class="sources__filters">
              <button
                v-for="filter in filters"
                :key="filter"
                @click="activeFilter = filter"
                :class="[
                  'sources__filter-btn',
                  activeFilter === filter ? 'sources__filter-btn--active' : ''
                ]"
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
  
  .header {
    background-color: #003b70;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 40px;
    box-sizing: border-box;
    width: 100%;
  }
  
  .header-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
  
  .sources__building-type {
    color: gray;
    margin-top: 8px;
  }
  
  @media (max-width: 991px) {
    .sources__buildings-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  
    .sources__panel {
      padding: 16px;
    }
  
    .sources__panel-inner {
      padding: 16px;
    }
  }
  </style>
  