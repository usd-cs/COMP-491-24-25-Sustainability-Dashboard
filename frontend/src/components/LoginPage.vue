<template>
  <!-- The main container for the login page -->
  <div class="login-page">
    <!-- Header section with the application title -->
    <header class="header">
      <h1 class="title">USD Office of <br />Sustainability</h1>
    </header>
    <!-- Main content with the login form -->
    <main>
      <form class="login-form" @submit.prevent="handleSubmit">
        <h2 class="form-title">Login to Upload Data</h2>
        <!-- Email input field -->
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-input"
            required
          />
        </div>
        <!-- Password input field -->
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-input"
            required
          />
        </div>
        <!-- Submit button -->
        <button type="submit" class="submit-button">Login</button>
      </form>
    </main>
  </div>
</template>

<script setup>
/**
 * @file LoginPage.vue
 * @description A Vue component for the login page where users can authenticate themselves to access the application.
 */

import { ref } from 'vue'; // Reactive variables for form inputs
import axios from 'axios'; // HTTP client for making API calls
import { useRouter } from 'vue-router'; // Vue Router for navigation

// Reactive variables for email and password inputs
const email = ref('');
const password = ref('');
const router = useRouter(); // Router instance for navigation

/**
 * Handle the login form submission.
 * Sends the user's email and password to the backend for authentication.
 * On success, redirects the user to the main page.
 * On failure, displays appropriate error messages.
 * 
 * @async
 * @returns {Promise<void>}
 */
const handleSubmit = async () => {
  try {
    // Make an API call to the login endpoint
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: email.value, // Send email input
      password: password.value, // Send password input
    });

    // If the response is successful, navigate to the main page
    if (response.status === 200) {
      alert(response.data.message); // Show success message
      localStorage.setItem('userId', response.data.user.user_id); // Save user ID in localStorage
      router.push('/main'); // Redirect to MainPage.vue
    }
  } catch (error) {
    // Handle error responses
    if (error.response) {
      alert(error.response.data.message); // Show backend error message
    } else {
      alert('Server error. Please try again later.'); // Show generic server error
    }
  }
};
</script>

<style scoped>
/**
 * Styles for the login page.
 * Scoped styles ensure these styles apply only to this component.
 */

/* Resetting Defaults */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%; /* Ensure it adapts to screen width */
  height: 100%; /* Ensure it adapts to screen height */
  font-family: 'Inter', sans-serif;
  background-color: #ffffff;
  overflow: hidden; /* Prevent scrolling */
}

/* Main container for the login page */
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100vw; /* Adapt to viewport width */
  height: 100vh; /* Fill the entire viewport height */
  background-color: #ffffff;
  overflow-y: hidden; /* Prevent vertical scrolling */
}

/* Header section */
.header {
  background: #00b1e2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 160px; /* Matches the Figma design */
  padding: 0 30px;
  box-sizing: border-box;
}

.title {
  font-size: 40px;
  font-weight: 400;
  color: #ffffff;
  text-align: left;
}

/* Main content section */
main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  width: 100%;
}

/* Login form styles */
.login-form {
  background: #d9d9d9;
  width: 454px;
  height: 578px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.form-title {
  font-size: 36px;
  margin-bottom: 50px;
  color: black;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 24px;
  margin-bottom: 10px;
  color: black;
  text-align: left;
}

.form-input {
  width: 100%;
  height: 50px;
  padding: 10px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  background-color: #00b1e2;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}
</style>
