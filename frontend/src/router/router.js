import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import MainPage from '../components/MainPage.vue';
import UploadData from '../components/UploadData.vue';

const routes = [
    { path: '/', component: LoginPage },
    { path: '/main', component: MainPage },
    { path: '/upload', component: UploadData },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;