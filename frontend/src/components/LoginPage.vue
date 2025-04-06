<template>
  <!-- The main container for the login page -->
  <div class="login-page">
    <!-- Header section with the application title -->
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
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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
    const response = await axios.post(`${apiBaseUrl}/api/auth/login`, {
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
  background: #003b70; /* Matches the dark blue in the official USD logo */
  display: flex;
  align-items: left;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
}

.header-content {
  display: flex;
  align-items: left;
  justify-content: space-between;
  flex-direction: column;
}

.logo {
  height: 47px;
  width: 266px; /* Adjust size */
  margin-bottom: 30px;
}

.title {
  font-size: 30px;
  font-weight: 550;
  color: #ffffff;
  text-align: center;
  line-height: 1.5;
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
  width: 360px; 
  padding: 35px; 
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.form-title {
  font-size: 20px; 
  font-weight: 700;
  margin-bottom: 25px; 
  color: black;
}

.form-group {
  margin-bottom: 18px; 
}

.form-label {
  display: block;
  font-size: 16px; 
  margin-bottom: 8px; 
  color: black;
  text-align: left;
}

.form-input {
  width: 100%;
  height: 40px; 
  padding: 10px; 
  font-size: 14px; 
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  width: 100%;
  padding: 12px; 
  font-size: 16px; 
  background-color: #003b70; 
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 18px; 
}
</style>