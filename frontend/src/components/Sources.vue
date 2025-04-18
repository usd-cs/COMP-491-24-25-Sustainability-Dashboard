<template>
  <AppLayout>
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
  </AppLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "./AppLayout.vue";

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
  { name: "West Parking", types: ["solar", "fuelcell"] },
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

</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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

@media (max-width: 991px) {
  .sources__buildings-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
