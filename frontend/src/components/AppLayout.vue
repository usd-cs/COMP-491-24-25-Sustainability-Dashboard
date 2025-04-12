<template>
  <div class="app-layout">
    <div class="background-pattern"></div>
    <NavBar />
    <div class="content">
    <slot></slot>
    </div>
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
  z-index: -1;
  pointer-events: none;
}
.app-layout {
  position: relative; /* Ensure child elements are positioned relative to this container */
  min-height: 100vh; /* Ensure the layout takes the full height of the viewport */
}

.content {
  position: relative; /* Ensure content is above the background */
  z-index: 1; /* Place content above the background */
  margin-top: 71px; /* Add a margin equal to the height of the nav bar */
}
</style>