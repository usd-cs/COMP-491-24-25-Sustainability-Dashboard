import { createRouter, createWebHistory } from "vue-router"; // Vue Router library
import LoginPage from "../components/LoginPage.vue"; // Login page component
import MainPage from "../components/MainPage.vue"; // Main page (dashboard) component
import UploadData from "../components/UploadData.vue"; // Upload data page component
import UploadSuccess from "../components/UploadSuccess.vue"; // Upload success confirmation component
import FileImport from "@/components/FileImport.vue";
import Sources from "@/components/Sources.vue";
import SourcesGraph from "@/components/SourcesGraph.vue";
import LineChart from "@/components/LineChart.vue";
import Initiatives from "@/components/Initiatives.vue";
import Contact from "@/components/Contact.vue"; // Contact page component
import BarChartExpand from "@/components/BarChartExpand.vue";
import PieChartExpand from "@/components/PieChartExpand.vue";
import BubbleChartExpand from "@/components/BubbleChartExpand.vue";

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
  { path: "/", component: LoginPage }, // Route for the login page
  { path: "/main", component: MainPage }, // Route for the main dashboard page
  { path: "/sources", component: Sources },
  { path: "/select", component: FileImport }, // Route for the file source select
  { path: "/upload", component: UploadData }, // Route for the upload data page
  { path: "/upload-success", component: UploadSuccess }, // Route for the upload success page
  { path: "/bar-chart", component: BarChartExpand }, // Route for the bar chart page
  { path: "/bubble-chart", component: BubbleChartExpand, props: { fullPage: true } },
  { path: "/pie-chart", component: PieChartExpand },
  { path: "/sources-graph", component: SourcesGraph },
  { path: "/line-chart", component: LineChart },
  { path: "/initiatives", component: Initiatives},
  { path: "/contact", component: Contact}
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
