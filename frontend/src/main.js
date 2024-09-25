import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'; 
import { store } from './store'; 
import { useAuthStore } from '@/store/auth';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(store); // Usando o Pinia
app.use(router); // Usando o vue-router
app.mount('#app');

// Adiciona a store de autenticação ao objeto global window para depuração no console
window.useAuthStore = useAuthStore;
