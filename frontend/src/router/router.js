import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/components/LoginPage.vue";
import MainPage from "@/components/MainPage.vue";
import UploadData from "@/components/UploadData.vue";
import UploadSuccess from "@/components/UploadSuccess.vue";
import FileImport from "@/components/FileImport.vue";
import Sources from "@/components/Sources.vue";
import SourcesGraph from "@/components/SourcesGraph.vue";
import Initiatives from "@/components/Initiatives.vue";
import Contact from "@/components/Contact.vue";

/* expanded / drill-down charts */
import BarChartExpand from "@/components/BarChartExpand.vue";
import BubbleChartExpand from "@/components/BubbleChartExpand.vue";
import PieChartExpand from "@/components/PieChartExpand.vue";
import LineChartExpand from "@/components/LineChartExpand.vue";

/**
 * @file router.js
 * @description Defines and configures the application's client-side routing using Vue Router.
 *              Each route maps a URL path to a Vue component.
 */

/**
 * Route definitions
 *
 * - `/`               → Login page
 * - `/main`           → Main dashboard
 * - `/upload`         → Data-upload form
 * - `/upload-success` → Upload confirmation
 * - plus drill-down pages for each chart and other utility pages
 *
 * @type {Array<{ path: string, component: Object, [props]?: Object }>}
 */
const routes = [
  { path: "/", component: LoginPage },
  { path: "/main", component: MainPage },

  /* data ingestion */
  { path: "/sources", component: Sources },
  { path: "/select", component: FileImport },
  { path: "/upload", component: UploadData },
  { path: "/upload-success", component: UploadSuccess },

  /* expanded charts */
  { path: "/bar-chart", component: BarChartExpand },
  { path: "/bubble-chart", component: BubbleChartExpand, props: { fullPage: true } },
  { path: "/pie-chart", component: PieChartExpand },
  { path: "/line-chart", component: LineChartExpand },

  /* misc utility pages */
  { path: "/sources-graph", component: SourcesGraph },
  { path: "/initiatives", component: Initiatives },
  { path: "/contact", component: Contact }
];

/**
 * Router instance
 *
 * @constant
 * @type {import('vue-router').Router}
 * @description Uses HTML5 history mode for clean URLs and the route table above.
 */
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
