import { createRouter, createWebHistory } from 'vue-router'; // Vue Router library
import LoginPage from '../components/LoginPage.vue'; // Login page component
import MainPage from '../components/MainPage.vue'; // Main page (dashboard) component
import UploadData from '../components/UploadData.vue'; // Upload data page component
import UploadSuccess from '../components/UploadSuccess.vue'; // Upload success confirmation component

/**
 * @file router.js
 * @description Defines and configures the application's client-side routing using Vue Router.
 * It sets up navigation paths and associates them with specific Vue components.
 */

/**
 * Define the routes for the application.
 * Each route specifies a path and the corresponding component to render.
 * 
 * Routes:
 * - `/`: Displays the login page.
 * - `/main`: Displays the main dashboard page.
 * - `/upload`: Displays the upload data page.
 * - `/upload-success`: Displays the upload success confirmation page.
 * 
 * @type {Array<{path: string, component: Object}>}
 */
const routes = [
  { path: '/', component: LoginPage }, // Route for the login page
  { path: '/main', component: MainPage }, // Route for the main dashboard page
  { path: '/upload', component: UploadData }, // Route for the upload data page
  { path: '/upload-success', component: UploadSuccess }, // Route for the upload success page
];

/**
 * @constant
 * @type {import('vue-router').Router}
 * @description Creates the Vue Router instance, using the web history mode for navigation.
 * - Web history mode provides clean URLs without hash symbols.
 * - Routes defined above are used to configure the router.
 */
const router = createRouter({
  history: createWebHistory(), // Use HTML5 history mode for clean URLs
  routes, // Attach defined routes to the router
});

export default router; // Export the router instance for use in the application
