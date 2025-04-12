<template>
    <AppLayout>
      <main class="main-content">
      </main>
    </AppLayout> 
  </template>
  
  <script setup>
  import { useRouter} from 'vue-router'; // Import Vue Router for navigation
  import AppLayout from './AppLayout.vue';
  </script>
  
  <style scoped>
  /* Reset styles */
  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  }
  
  .main-content {
    width: 100%;
    max-width: 1400px;  
    margin: 0 auto;
    padding: 20px;       
    box-sizing: border-box;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  </style>