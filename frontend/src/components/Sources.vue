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
              {{ formatFilterText(filter) }}
            </button>
          </nav>

          <h2 class="sources__grid-title">
            {{ activeFilter === 'all' ? 'All Buildings' : formatFilterText(activeFilter) + ' Buildings' }}
          </h2>

          <section class="sources__buildings-grid">
            <article
              v-for="building in filteredBuildings"
              :key="building.name"
              class="sources__building-card"
              @click="navigateToGraph(building.name)"
            >
              <h3 class="sources__building-name">{{ building.name }}</h3>
              <p class="sources__building-type">Type: {{ building.types.join(', ') }}</p>
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

const activeFilter = ref("solar"); // Starting with 'solar'
const filters = ["all", "electricity", "fuelcell", "solar"];

// Function to format the filter text
const formatFilterText = (filter) => {
  if (filter === "all") {
    return "All";
  }
  return filter.charAt(0).toUpperCase() + filter.slice(1);
};

const buildings = [
  { name: "Alcala Borrego", types: ["electricity", "solar"] },
  { name: "Alcala Laguna", types: ["electricity", "solar"] },
  { name: "Camino Hall", types: ["electricity", "solar"] },
  { name: "Copley Library", types: ["electricity", "solar"] },
  { name: "Founders Hall", types: ["electricity", "solar"] },
  { name: "Jenny Craig Pavilion", types: ["electricity", "solar"] },
  { name: "Kroc", types: ["electricity", "fuelcell"] },
  { name: "Manchester A", types: ["electricity", "solar"] },
  { name: "Manchester B", types: ["electricity", "solar"] },
  { name: "Soles", types: ["electricity", "solar"] },
  { name: "West Parking - Solar", types: ["solar"] },
  { name: "West Parking - Fuel Cell", types: ["fuelcell"] },
];

// Computed property to filter buildings based on selected filter
const filteredBuildings = computed(() => {
  if (activeFilter.value === "all") {
    return buildings; // Show all buildings when 'all' is selected
  }
  return buildings.filter(b => b.types.includes(activeFilter.value)); // Filter buildings based on the active type
});

// Selected building
const selectedBuilding = ref(null);

// Function to select a building and display its graph
const navigateToGraph = (buildingName) => {
  const formattedName = buildingName.toLowerCase().replace(/\s+/g, "_"); // Format the building name
  router.push({ path: `/sources-graph`, query: { buildingName: formattedName } }); // Navigate to /sources-graph with query params
};

// Navigation functions
const navigateToMain = () => router.push('/main');
const navigateToSources = () => router.push('/sources');
const navigateToInitiatives = () => router.push('/initiatives');
const navigateToContact = () => router.push('/contact');

// Handle logout
const handleLogout = () => router.push("/");
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter&display=swap");

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

.dashboard-container {
  position: relative;
  z-index: 0;
}

.nav-menu {
  background-color: #003b70;
  height: 71px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  box-sizing: border-box;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 30px;
  height: 100%;
  width: 100%;
  padding-right: 60px;
}

.nav-items {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
  height: 100%;
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

.logo-img {
  height: 50px;
}

.navLi {
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
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

.logout-btn:hover {
  background-color: #ffffff;
  color: #003b70;
}

/* Sources Content */

.sources__grid-title {
  font-size: 24px;
  font-weight: 600;
  color: #003b70;
  margin-bottom: 16px;
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
  cursor: pointer;
}

.sources__building-name {
  font-size: 18px;
  font-weight: 600;
  color: #003b70;
}

.sources__building-card:hover {
  background-color: #f0f0f0;
}

/* Visualization Grid */
.visual-container {
  background: transparent;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 18px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  height: calc(100vh - 71px - 40px);
  border-radius: 8px;
}

.visual-section {
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  padding: 10px;
  box-sizing: border-box;
  border: 2px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.visual-section > * {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  border-radius: 8px;
}

@media (max-width: 991px) {
  .sources__buildings-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
