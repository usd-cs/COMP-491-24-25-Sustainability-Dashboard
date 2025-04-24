<template>
    <AppLayout>
      <main class="initiatives__content">
     
      </main>
    </AppLayout>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import AppLayout from "./AppLayout.vue";
  
  const router = useRouter();

  </script>
  
  <style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Inter&display=swap");
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
 
  
  @media (max-width: 991px) {
    .sources__buildings-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  </style>
  