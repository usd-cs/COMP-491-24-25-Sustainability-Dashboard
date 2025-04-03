<template>
    <div class="min-h-screen w-screen bg-[#fff] font-[Inter]">
      <header class="header">
        <div class="header-content">
          <a
            href="https://www.sandiego.edu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://www.sandiego.edu/brand/images/logos/master-secondary/usd-logo-secondary-2c-reversed.png"
              alt="University of San Diego Logo"
              class="logo"
            />
          </a>
          <h1 class="title">USD Office of Sustainability</h1>
        </div>
        <div class="user-section">
          <button class="logout-btn" @click="handleLogout" tabindex="0">
            Logout →
          </button>
        </div>
      </header>
  
      <main class="p-[24px]">
        <div class="bg-[#003B6F] p-[24px] rounded-[4px]">
          <div class="bg-white p-[24px] rounded-[4px]">
            <nav
              class="flex gap-[32px] items-center border-b border-[#6C6C6C] pb-[12px] mb-[24px]"
            >
              <button
                v-for="filter in filters"
                :key="filter"
                @click="activeFilter = filter"
                :class="[
                  'text-[20px]',
                  activeFilter === filter ? 'font-bold' : 'font-normal',
                ]"
              >
                {{
                  filter === "all"
                    ? "All"
                    : filter.charAt(0).toUpperCase() + filter.slice(1)
                }}
              </button>
            </nav>
  
            <section
              class="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-[24px]"
            >
              <article
                v-for="building in filteredBuildings"
                :key="building.name"
                class="bg-white p-4 rounded shadow-md"
              >
                <h3 class="text-xl font-semibold text-[#003B6F]">
                  {{ building.name }}
                </h3>
                <p class="text-gray-600 mt-2 capitalize">
                  Type: {{ building.type }}
                </p>
              </article>
            </section>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  type BuildingType = "electricity" | "solar" | "fuelcell";
  type FilterType = BuildingType | "all";
  
  interface Building {
    name: string;
    type: BuildingType;
  }
  
  const activeFilter = ref<FilterType>("all");
  const filters: FilterType[] = ["all", "electricity", "fuelcell", "solar"];
  
  const buildings: Building[] = [
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
    font:
      400 16px Inter,
      sans-serif;
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
  
  @media (max-width: 991px) {
    .header {
      padding: 10px 20px;
    }
  }
  </style>
  