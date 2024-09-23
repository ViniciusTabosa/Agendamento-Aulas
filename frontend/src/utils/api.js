import axios from 'axios';
import { useAuthStore } from '@/store/auth'; 
import router from '@/router';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL do backend
});

// Intercepta cada requisição antes de ser enviada
instance.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  
  // Verifica a expiração do token
  authStore.checkTokenExpiration();

  // Adiciona o token no header Authorization, se estiver presente
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log(token);
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercepta respostas com erro
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();

    if (error.response && error.response.status === 401) {
      // Desloga o usuário em caso de token inválido ou expirado
      authStore.logout();
      alert('Sessão expirada ou inválida. Por favor, faça login novamente.');
      router.push('/login');
    }

    return Promise.reject(error);
  }
);

export default instance;
