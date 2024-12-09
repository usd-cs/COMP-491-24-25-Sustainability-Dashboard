import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import MainPage from '../components/MainPage.vue';
import UploadData from '../components/UploadData.vue';
import UploadSuccess from '../components/UploadSuccess.vue';

const routes = [
    { path: '/', component: LoginPage },
    { path: '/main', component: MainPage },
    { path: '/upload', component: UploadData },
    { path: '/upload-success', component: UploadSuccess },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;