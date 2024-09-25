import { defineStore } from 'pinia';
import axios from '@/utils/api.js'; 
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem('user')) || null, // Usando sessionStorage
    token: sessionStorage.getItem('token') || '',
  }),
  actions: {
    async login({ email, senha }) {
      try {
        const response = await axios.post('/login', { email, senha });

        // Armazena o token e o userId
        this.token = response.data.token;
        sessionStorage.setItem('token', this.token);

        this.user = { nome: response.data.nome, sobrenome: response.data.sobrenome, userId: response.data.userId };
        console.log(this.user);
        sessionStorage.setItem('user', JSON.stringify(this.user));
        sessionStorage.setItem('usuarioId', response.data.userId); // Salva o userId separadamente para acessos diretos
        sessionStorage.setItem('perfilCode', response.data.perfilCode);

      } catch (error) {
        console.error('Erro durante o login:', error);
        throw error;
      }
    },
    logout() {
      this.token = '';
      this.user = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('usuarioId');
    },
    checkTokenExpiration() {
      const router = useRouter();

      if (!this.token) {
        return; // Se não houver token, não faça nada
      }
    
      const decoded = this.decodeToken(this.token);
      
      if (!decoded) {
        this.logout();
        return; // Se o token for inválido, faz logout
      }
    
      const tokenExpirationTime = decoded.exp * 1000; // Converte para milissegundos
      const currentTime = Date.now();
    
      if (currentTime > tokenExpirationTime) {
        this.logout();
        alert('Sua sessão expirou. Faça login novamente.');
        router.push('/login');
      }
    },    
    decodeToken(token) {
      try {
        const payload = token.split('.')[1]; // Pega a parte do payload do JWT
        return JSON.parse(atob(payload)); // Decodifica e retorna o JSON do payload
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null; // Retorna null caso o token esteja malformado
      }
    }    
  }
});
