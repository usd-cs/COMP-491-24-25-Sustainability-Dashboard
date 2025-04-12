<template>
    <div class="background-pattern">
      <NavBar />
      <slot></slot> <!-- This will render the content of each page -->
    </div>
  </template>
  
  <script setup>
  import NavBar from './NavBar.vue';
  </script>
  
  <style scoped>
  .background-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fafafa;
    background-image: url('https://s8kvb6qnle.execute-api.us-west-2.amazonaws.com/?hash=57e2f2c6f8c556e8de9634c71a03601a&url=https://www.sandiego.edu/admission-and-aid/undergraduate/images/campus-beauty.jpg&width=2100&webp=true');
    opacity: 0.87;
    z-index: -1000;
    pointer-events: none;
  }
  </style>