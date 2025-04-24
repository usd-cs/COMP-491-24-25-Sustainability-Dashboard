
<template>
    <button class="upload-btn" @click="navigateToSelect">
      ⬆ Upload
    </button>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const navigateToSelect = () => {
    router.push('/select');
  };
  </script>
  
  <style scoped>
  .upload-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 2000;
    background-color: #0077cc;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 15px 20px;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    transition: background-color 0.3s ease;
  }
  
  .upload-btn:hover {
    background-color: #005fa3;
  }
  </style>
  