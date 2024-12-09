<template>
  <div class="login-page">
    <header class="header">
      <h1 class="title">USD Office of <br />Sustainability</h1>
      <button class="nav-button">Login</button>
    </header>
    <main>
      <form class="login-form" @submit.prevent="handleSubmit">
        <h2 class="form-title">Login to Upload Data</h2>
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
        <button type="submit" class="submit-button">Login</button>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const handleSubmit = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: email.value, // Sending email instead of username
      password: password.value,
    });

    if (response.status === 200) {
      alert(response.data.message); // Display success message
      localStorage.setItem('userId', response.data.user.user_id); // Store user ID
      router.push('/main'); // Redirect to MainPage.vue
    }
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message); // Display error message from backend
    } else {
      alert('Server error. Please try again later.');
    }
  }
};
</script>

<style scoped>
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

/* Header Section */
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

.nav-button {
  background: #d9d9d9;
  font-size: 24px;
  padding: 10px 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Login Form Section */
main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  width: 100%;
}

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
