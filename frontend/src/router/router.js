import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import MainPage from '../components/MainPage.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/main', component: MainPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;