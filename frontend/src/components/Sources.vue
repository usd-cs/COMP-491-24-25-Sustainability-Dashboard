<template>
  <AppLayout>
    <main class="sources__content">
      <section class="sources__panel">
        <div class="sources__panel-inner">
          <h2 class="sources__grid-title">All Solar Sites</h2>

          <section class="sources__buildings-grid">
            <article
              v-for="building in buildings"
              :key="building.name"
              class="sources__building-card"
              @click="navigateToGraph(building.name)"
            >
              <h3 class="sources__building-name">{{ building.name }}</h3>
              <p class="sources__building-panels">{{ building.panels }} panels</p>
            </article>
          </section>
        </div>
      </section>
    </main>
  </AppLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "./AppLayout.vue";

const router = useRouter();

const buildings = [
  { name: "Alcala Borrego", types: ["solar"], panels: 126 },
  { name: "Alcala Laguna", types: ["solar"], panels: 126 },
  { name: "Camino Hall", types: ["solar"], panels: 980 },
  { name: "Copley Library", types: ["solar"], panels: 266 },
  { name: "Founders Hall", types: ["solar"], panels: 308 },
  { name: "Jenny Craig Pavilion", types: ["solar"], panels: 910 },
  { name: "Kroc", types: ["solar"], panels: 512 },
  { name: "Manchester A", types: ["solar"], panels: 272 },
  { name: "Manchester B", types: ["solar"], panels: 272 },
  { name: "Soles/MRH", types: ["solar"], panels: 546 },
  { name: "West Parking", types: ["solar"], panels: 896 },
];

// Function to select a building and display its graph
const navigateToGraph = (buildingName) => {
  // Special case for Soles/MRH to match backend routing
  let formattedName = buildingName;
  if (buildingName === "Soles/MRH") {
    formattedName = "soles";
  } else {
    formattedName = buildingName.toLowerCase().replace(/\s+/g, "_");
  }
  router.push({ path: `/sources-graph`, query: { buildingName: formattedName } });
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

@media (max-width: 480px) {
  .sources__content {
    padding: 16px;
  }

  .sources__panel {
    padding: 16px;
  }

  .sources__panel-inner {
    padding: 16px;
  }

  .sources__filters {
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    text-align: center;
  }

  .sources__filter-btn {
    font-size: 16px;
  }

  .sources__grid-title {
    font-size: 20px;
    text-align: center;
  }

  .sources__buildings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
    width: 100%;
  }

  .sources__building-card {
    aspect-ratio: 1 / 1; /* makes each card a square */
    background-color: #6ea1ce;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .sources__building-name {
    font-size: 16px;
  }
}

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
  border-radius: 8px;
}

.sources__panel-inner {
  background-color: white;
  padding: 24px;
  border-radius: 4px;
  min-height: 500px;
  box-sizing: border-box;
}

@media (max-width: 400px) {
  .sources__building-card {
    font-size: 14px;
    padding: 5px;
  }
  .sources__buildings-grid {
    gap: 12px;
  }
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
  background-color: #6ea1ce;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sources__building-name {
  font-size: 18px;
  font-weight: 600;
  color: #003b70;
}

.sources__building-panels {
  font-size: 14px;
  color: #003b70;
  margin-top: 8px;
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
