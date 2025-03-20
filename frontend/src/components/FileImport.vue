<template>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
    rel="stylesheet"
  />
  <main class="file-import">
    <header class="file-import__header">USD Office of Sustainability</header>
    <section class="file-import__content">
      <div class="import-panel">
        <h1 class="import-panel__title">Import Files</h1>
        <hr class="import-panel__divider" />
        <div class="import-panel__dropzone">
          <div class="source-selector">
            <h2 class="source-selector__title">Select file source</h2>
            <div class="source-selector__options">
              <label class="source-option" @click="selectSource('Athena')">
                <span class="source-option__label">Athena</span>
                <span
                  class="source-option__radio"
                  v-html="selectedSource === 'Athena' ? selectedRadioSvg : unselectedRadioSvg"
                ></span>
              </label>
              <label class="source-option" @click="selectSource('Bloom')">
                <span class="source-option__label">Bloom</span>
                <span
                  class="source-option__radio"
                  v-html="selectedSource === 'Bloom' ? selectedRadioSvg : unselectedRadioSvg"
                ></span>
              </label>
            </div>
            <button class="source-selector__submit" @click="navigateToUpload">Submit</button>
          </div>
        </div>
      </div>
      <button class="file-import__cancel" @click="navigateToMain">Cancel</button>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const selectedSource = ref(localStorage.getItem("selectedSource") || "Athena"); // Load from localStorage

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

const selectedRadioSvg = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_80_109)">
<circle cx="9.5" cy="5.5" r="5.5" fill="#242323" fill-opacity="0.5" shape-rendering="crispEdges"></circle>
<circle cx="9.5" cy="5.5" r="5" stroke="black" shape-rendering="crispEdges"></circle>
</g>
<defs>
<filter id="filter0_d_80_109" x="0" y="0" width="19" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
<feOffset dy="4"></feOffset>
<feGaussianBlur stdDeviation="2"></feGaussianBlur>
<feComposite in2="hardAlpha" operator="out"></feComposite>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_80_109"></feBlend>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_80_109" result="shape"></feBlend>
</filter>
</defs>
</svg>`;

const unselectedRadioSvg = `<svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="11.5" cy="10.5" rx="11.5" ry="10.5" fill="#D9D9D9"></ellipse>
</svg>`;
</script>

<style scoped>
.file-import {
  width: 100%;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
}

.file-import__header {
  color: #fff;
  font-size: 40px;
  max-width: 320px;
  background-color: #00b1e2;
  padding: 35px 24px;
  width: 100%;
}

.file-import__content {
  padding: 24px;
  max-width: 1067px;
  margin: 0 auto;
}

.import-panel {
  padding: 10px;
  border-radius: 2px;
  background-color: #d9d9d9;
}

.import-panel__title {
  font-size: 24px;
  color: #000;
  margin-bottom: 6px;
}

.import-panel__divider {
  height: 1px;
  margin: 10px 0;
  background-color: #1e1e1e;
  border: none;
}

.import-panel__dropzone {
  border: 1px dashed #000;
  padding: 20px;
  min-height: 454px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d9d9d9;
}

.source-selector {
  padding: 20px;
  width: 189px;
  background-color: #fff;
}

.source-selector__title {
  color: #00b1e2;
  font-size: 16px;
  margin-bottom: 15px;
}

.source-selector__options {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.source-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.source-option__label {
  font-size: 16px;
  color: #000;
}

.source-selector__submit {
  color: #fff;
  border: none;
  padding: 8px 24px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  width: 116px;
  background-color: rgba(0, 177, 226, 0.9);
}

.file-import__cancel {
  color: #00b1e2;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
  background-color: #fff;
}
</style>
