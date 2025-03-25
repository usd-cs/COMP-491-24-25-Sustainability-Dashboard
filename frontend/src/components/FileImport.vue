<template>
  <div class="file-import">
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
              </label>
              <label class="source-option" @click="selectSource('Bloom')">
                <span class="source-option__label">Bloom</span>
                <span class="source-option__radio" v-html="selectedSource === 'Bloom' ? selectedRadioSvg : unselectedRadioSvg"></span>
              </label>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Wrapping both buttons in a flex container -->
      <div class="file-import__buttons">
        <button class="file-import__cancel" @click="navigateToMain">Cancel</button>
        <button class="source-selector__submit" @click="navigateToUpload">Submit</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const selectedSource = ref(localStorage.getItem("selectedSource") || "Athena");

const selectSource = (source) => {
  selectedSource.value = source;
  localStorage.setItem("selectedSource", source);
};

const navigateToMain = () => {
  router.push("/main");
};

const navigateToUpload = () => {
  router.push("/upload");
};

const handleLogout = () => {
  // Handle logout logic here
};

const selectedRadioSvg = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_80_109)">
<circle cx="9.5" cy="5.5" r="5.5" fill="#003B70" />
</g>
</svg>`;

const unselectedRadioSvg = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="9.5" cy="9.5" r="5.5" stroke="#003B70" stroke-width="2" fill="white" />
</svg>`;
</script>

<style scoped>
.file-import {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  overflow: hidden;
}

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

.file-import__content {
  background-color: #f4f4f4; /* Light gray background for the upload section */
  width: 100%;
  max-width: 700px;
  margin: 40px auto 0;
  padding: 30px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
