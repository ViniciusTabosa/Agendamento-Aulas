<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/images/logo.jpg" alt="Logo do Site" />
      <span class="system-name">class scheduling</span>
    </div>
    <nav class="menu">
      <router-link to="/" class="menu-item">Início</router-link>
      <router-link to="/about" class="menu-item">Sobre</router-link>
      <router-link to="/catalog" class="menu-item">Catálogo</router-link>
    </nav>
    <div v-if="isLoggedIn" class="user-menu">
      <div class="user-info" @click="toggleDropdown">
        <span class="username">Olá, {{ username }}!</span>
        <span class="arrow-down" :class="{ open: isDropdownOpen }">&#9662;</span>
      </div>
      <ul v-if="isDropdownOpen" class="dropdown-menu">
        <li><router-link to="/user-profile">Meu Perfil</router-link></li>
        <li v-if="!isAdmin"><router-link to="/my-scheduled-classes">Meus Agendamentos</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin/users-management">Gerenciar Usuários</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin/class-management">Gerenciar Aulas</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin/categories-management">Gerenciar Categorias</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin/scheduling-management">Gerenciar Agendamentos</router-link></li>
        <li><a class="logout-link" @click="handleLogout">Sair</a></li>
      </ul>
    </div>
    <div v-else>
      <router-link v-if="isLoginPage" to="/register" class="login-btn">Cadastre-se</router-link>
      <router-link v-else to="/login" class="login-btn">Login</router-link>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from '@/store/auth'; // Importa a store de autenticação

export default {
  name: 'HeaderComponent',
  data() {
    return {
      isLoginPage: false,
      isDropdownOpen: false, // Flag para controlar o dropdown
    };
  },
  computed: {
    // Acessa o estado do Pinia
    authStore() {
      return useAuthStore(); // Retorna a instância da store de autenticação
    },
    isLoggedIn() {
      return this.authStore.token !== ''; // Verifica se o token está presente
    },
    username() {
      return this.authStore.user ? this.authStore.user.nome : ''; // Retorna o nome do usuário logado
    },
    isAdmin() {
      return this.authStore.user && sessionStorage.getItem('perfilCode') === '001'; // Verifica se o perfil é de admin
    }
  },
  watch: {
    $route(to) {
      this.isLoginPage = to.path === '/login'; // Verifica se a rota é /login
    },
  },
  mounted() {
    this.isLoginPage = this.$route.path === '/login';
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen; // Alterna a exibição do menu suspenso
    },
    handleLogout() {
      this.authStore.logout(); // Chama o método de logout da store
      this.$router.push('/'); // Redireciona para a página inicial
      this.isDropdownOpen = false; // Fecha o dropdown após logout
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fbfaff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  height: 10%;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 50px;
  margin-right: 10px;
}

.system-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #644fc1;
}

/* Estilos para o container do menu e usuário */
.user-and-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Menu de navegação */
.menu {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-item {
  text-decoration: none;
  color: #5746af;
  font-weight: bold;
  transition: color 0.3s ease;
}

.menu-item:hover {
  color: #644fc1;
}

/* Barra separadora entre os itens do menu */
.separator {
  color: #5746af;
}

/* Estilos para o menu do usuário */
.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  font-weight: bold;
  color: #5746af;
  margin-right: 10px;
}

.login-btn, .logout-btn {
  background-color: #6e56cf;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;
}

.login-btn:hover, .logout-btn:hover {
  background-color: #644fc1;
}

.arrow-down {
  font-size: 18px;
  color: #5746af;
  transition: transform 0.3s ease;
}

.arrow-down.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 0;
  width: 150px;
  z-index: 1000; 
}


.dropdown-menu li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.dropdown-menu li:last-child {
  border-bottom: none;
}

.dropdown-menu li a {
  text-decoration: none;
  color: #5746af;
  font-weight: bold;
  display: block;
  text-align: left;
}

.dropdown-menu li a:hover {
  background-color: #f5f2ff;
}

.logout-link {
  cursor: pointer;
}
</style>
