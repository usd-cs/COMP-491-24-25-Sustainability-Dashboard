<template>
  <AppLayout>
    <div class="file-import">
      <main class="file-import__content">
        <section class="import-panel">
          <h1 class="import-panel__title">Import Files</h1>
          <hr class="import-panel__divider" />
          <div class="import-panel__dropzone">
            <div class="source-selector">
              <h2 class="source-selector__title">Select file source</h2>
              <div class="source-selector__options">
                <label class="source-option" @click="selectSource('Athena')">
                  <span class="source-option__label">Athena</span>
                  <span class="source-option__radio" v-html="selectedSource === 'Athena' ? selectedRadioSvg : unselectedRadioSvg"></span>
                  <span class="source-option__stamp">Last updated: {{ athenaTimestamp || 'N/A' }}</span>
                </label>
                <label class="source-option" @click="selectSource('Bloom')">
                  <span class="source-option__label">Bloom</span>
                  <span class="source-option__radio" v-html="selectedSource === 'Bloom' ? selectedRadioSvg : unselectedRadioSvg"></span>
                  <span class="source-option__stamp">Last updated: {{ bloomTimestamp || 'N/A' }}</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        <div class="file-import__buttons">
          <button class="file-import__cancel" @click="navigateToMain">Cancel</button>
          <button class="source-selector__submit" @click="navigateToUpload">Submit</button>
        </div>
      </main>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "./AppLayout.vue";

// router and state
const router = useRouter();
const selectedSource = ref(localStorage.getItem("selectedSource") || "Athena");

// timestamps
const athenaTimestamp = ref(localStorage.getItem("AthenaTimestamp"));
const bloomTimestamp = ref(localStorage.getItem("BloomTimestamp"));

// radio SVGs
const selectedRadioSvg = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_80_109)">
<circle cx="9.5" cy="5.5" r="5.5" fill="#003B70" />
</g>
</svg>`;

const unselectedRadioSvg = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="9.5" cy="9.5" r="5.5" stroke="#003B70" stroke-width="2" fill="white" />
</svg>`;

// select source logic
const selectSource = async (source) => {
  if (selectedSource.value === source) return;

  selectedSource.value = source;
  localStorage.setItem("selectedSource", source);

  let url = "";
  if (source === "Athena") {
    url = "http://localhost:3000/api/tables/hourlyenergybybuilding";
  } else if (source === "Bloom") {
    url = "http://localhost:3000/api/tables/bloomdate";
  }


  try {
    const { data } = await axios.get(url);

    console.log("API Response:", data);

    if (data) {
      localStorage.setItem(`${source}Timestamp`, data);

      // Update the timestamp in the reactive state
      if (source === "Athena") {
        athenaTimestamp.value = data;
      } else if (source === "Bloom") {
        bloomTimestamp.value = data;
      }
    } else {
      console.error("No timestamp found in response");
    }
  } catch (error) {
    console.error("Failed to fetch timestamp:", error);
  }
};


// navigation
const navigateToMain = () => {
  router.push("/main");
};

const navigateToUpload = () => {
  router.push("/upload");
};
</script>

<style scoped>

.file-import {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  height: 100%;
  width: 100%;
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

.file-import__content {
  background-color: #f4f4f4; /* Light gray background for the upload section */
  width: 100%;
  max-width: 700px;
  margin: 40px auto 0;
  padding: 30px 20px;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.import-panel__title {
  font: 700 20px Inter, sans-serif;
  color: #003b70;
  text-align: center;
  margin-bottom: 20px;
}

.import-panel__divider {
  background-color: #003b70;
  height: 2px;
  width: 100%;
  margin-bottom: 20px;
}

.source-selector__title {
  font: 700 18px Inter, sans-serif;
  color: #003b70;
  margin-bottom: 10px;
  text-align: center;
}

.source-selector__options {
  display: flex;
  flex-direction: column;
  align-items: flex;
}

.source-option {
  display: flex;
  align-items: center;  /* Center content vertically */
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
  gap: 10px;
}

.source-option__label {
  font-size: bold;
  font: 400 20px Inter, sans-serif;
  color: #003b70;
  margin-right: 40px;
}

.source-option__radio {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  display: inline-block;  /* Ensure it stays in line */
  vertical-align: middle; /* Align it properly */
  padding: 2px;
}

.source-option__stamp {
  color:#003b70;
}

/* Flex container for buttons */
.file-import__buttons {
  display: flex;
  justify-content: space-between; /* Align buttons horizontally */
  width: 100%; /* Make buttons span the full width */
  margin-top: 20px;
}

.file-import__cancel,
.source-selector__submit {
  width: 48%; /* Ensure buttons have similar width */
  font: 400 16px Inter, sans-serif;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-import__cancel {
  background-color: #ffffff;
  color: #003b70;
  border: 2px solid #003b70;
}

.file-import__cancel:hover {
  background-color: #003b70;
  color: #ffffff;
}

.source-selector__submit {
  background-color: #003b70;
  color: #ffffff;
}

.source-selector__submit:hover {
  background-color: #0056a4;
}

@media (max-width: 991px) {
  .header {
    padding: 10px 20px;
  }

  .file-import__content {
    padding: 20px;
  }
}
</style>
