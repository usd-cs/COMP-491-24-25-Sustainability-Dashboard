<template>
  <div>
    <h2>Electricity Output Over Time</h2>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    <pre>{{ data }}</pre> <!-- Display data for debugging -->
  </div>
 </template>
 
 
 <script setup>
 import { onMounted, ref } from 'vue';
 import axios from 'axios';
 
 
 const data = ref(null); // Data to be displayed in the template
 const errorMessage = ref(''); // To store any error messages
 
 
 // Retrieve the building name from localStorage
 const athena_building_name = localStorage.getItem('selectedBuilding'); // Get the selected building name
 
 
 onMounted(async () => {
  if (!athena_building_name) {
    console.warn('No building selected.');
    errorMessage.value = 'No building selected.';
    return;
  }
 
 
  try {
    // Make the GET request with the building name as a URL parameter
    const response = await axios.get(`http://localhost:3000/api/tables/${athena_building_name}`);
    const fetchedData = response.data;
 
 
    if (!fetchedData || fetchedData.length === 0) {
      console.warn('No Athena data available.');
      errorMessage.value = 'No Athena data available.';
      return;
    }
 
 
    data.value = fetchedData; // Store the data in the ref to display
    console.log("hi"); // Log the data for debugging
 
 
  } catch (error) {
    console.error('Error fetching Athena hourly data:', error);
    errorMessage.value = `Error fetching data: ${error.response ? error.response.data.message : error.message}`;
  }
 });
 </script>
 
 
 <style scoped>
 h2 {
  text-align: center;
  margin-bottom: 1rem;
 }
 pre {
  white-space: pre-wrap; /* Ensure it wraps properly */
  word-wrap: break-word;
  font-size: 14px;
 }
 </style>
 
 
 
 
 
 