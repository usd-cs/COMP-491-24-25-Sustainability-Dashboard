<template>
  <AppLayout>
      <main>
        <form class="login-form" @submit.prevent="handleSubmit">
          <h2 class="form-title">administrative login</h2>
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
  </AppLayout>
</template>

<script setup>
/**
 * @file LoginPage.vue
 * @description A Vue component for the login page where users can authenticate themselves to access the application.
 */

import { ref } from 'vue'; // Reactive variables for form inputs
import axios from 'axios'; // HTTP client for making API calls
import { useRouter } from 'vue-router'; // Vue Router for navigation
import AppLayout from './AppLayout.vue';

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
    const apiUrl = import.meta.env.VITE_API_URL;
    // Make an API call to the login endpoint
    const response = await axios.post(`${apiUrl}api/auth/login`, {
      email: email.value, // Send email input
      password: password.value, // Send password input
    });

    // If the response is successful, navigate to the main page
    if (response.status === 200) {
      alert(response.data.message); // Show success message
      localStorage.setItem('userId', response.data.user.user_id); // Save user ID in localStorage
      router.push('/select'); // Redirect to MainPage.vue
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
  background: #f3f3f3;
  width: 360px; 
  padding: 35px; 
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  margin: 20px;
}

.form-title {
  font-size: 25px; 
  font-weight: 700;
  margin-bottom: 25px; 
  color: #003b70;
  font-variant: small-caps;
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