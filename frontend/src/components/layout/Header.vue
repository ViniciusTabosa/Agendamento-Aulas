<template>
  <header class="header-bg">
    <div class="header">
      <nav>
        <ul class="header-menu">
          <li><a href="./">Início</a></li>
          <li><a href="/about">Quem somos</a></li>
          <li><a href="/instrutores">Nossos Instrutores</a></li>
          <li><a href="/aulas">Nossas Aulas</a></li>
        </ul>
      </nav>
      
      <div><img src="../../fotos/logoMaior.png" alt="Logo" class="logo"></div>
      
      <!-- Verificar se o usuário está logado -->
      <div v-if="isLoggedIn" class="user-menu">
        <div class="user-info" @click="toggleDropdown">
          <span class="username">Olá, {{ username }}!</span>
          <span class="arrow-down" :class="{ open: isDropdownOpen }">&#9662;</span>
        </div>
        <ul v-if="isDropdownOpen" class="dropdown-menu">
          <div class="menu-usuario">
            <img src="../../fotos/user-avatar.png" alt="">
            <div class="menu-desc">
              <li><router-link to="/user-profile" class="link">Meu Perfil</router-link></li>
            </div>
          </div>
          <div class="menu-usuario">
            <img src="../../fotos/calendar.png" alt="" v-if="!isAdmin">
            <div class="menu-desc">
              <li v-if="!isAdmin"><router-link to="/my-scheduled-classes" class="link">Meus Agendamentos</router-link></li>
            </div>
          </div>
          
            <div class="menu-usuario">
              <img src="../../fotos/profile.png" alt="" v-if="isAdmin">
              <div class="menu-desc">
                <li v-if="isAdmin"><router-link to="/admin/users-management" class="link">Gerenciar Usuários</router-link></li>
              </div>
            </div>
            <div class="menu-usuario2">
              <img src="../../fotos/project.png" alt="" v-if="isAdmin">
              <div class="menu-desc">
                <li v-if="isAdmin"><router-link to="/admin/class-management" class="link">Gerenciar Aulas</router-link></li>
              </div>
            </div>
            <div class="menu-usuario">
              <img src="../../fotos/layers.png" alt="" v-if="isAdmin">
              <div class="menu-desc">
                <li v-if="isAdmin"><router-link to="/admin/categories-management" class="link">Gerenciar Categorias</router-link></li>
              </div>
            </div>
            <div class="menu-usuario">
              <img src="../../fotos/group.png" alt="" v-if="isAdmin">
              <div class="menu-desc">
                <li v-if="isAdmin"><router-link to="/admin/scheduling-management" class="link">Gerenciar Agendamentos</router-link></li>
              </div>
            </div>
         
          <div class="menu-usuario">
            <img src="../../fotos/exit.png" alt="">
            <div class="menu-desc">
              <li><a class="logout-link link" @click="handleLogout">Sair</a></li>
            </div>
          </div>
        </ul>
      </div>


      <!-- Botões de login e cadastro -->
      <div class="header-btn" v-else>
        <router-link to="/login" class="btn-login">Login</router-link>
        <router-link to="/register" class="btn-cadastro">Cadastrar</router-link>
      </div>
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
    authStore() {
      return useAuthStore(); // Retorna a instância da store de autenticação
    },
    isLoggedIn() {
      return this.authStore.token !== ''; // Verifica se o token está presente (usuário logado)
    },
    username() {
      return this.authStore.user ? this.authStore.user.nome : ''; // Retorna o nome do usuário logado
    },
    isAdmin() {
      return this.authStore.user && sessionStorage.getItem('perfilCode') === '001'; // Verifica se o perfil é de admin
    },
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

.user-menu{
  position: absolute;
  right: 0;
}

.link{

  padding: 5px;
  color: #F5F1E9;

}

.link:hover{
 color: #f5f1e99a;
}

.link, .username{
  font-family: "Open Sans", sans-serif;
  font-size: 1rem;

}

.username {
  color: #2C3E50;
  margin-right: 10px;
}

.user-info{
  margin-right: 130px;
  cursor: pointer;
  margin-top: -8px;
  position: relative;
}

.dropdown-menu{
  position: absolute;
  top:100%;
  left: 0;
  z-index: 1000;
  font-family: "Open Sans", sans-serif;
  font-size: 1rem;
   margin-left:-50px;
   margin-top: 20px;
   height: auto;
   width: auto;
   animation: animation 0.5s ease-out normal none;
   padding: 20px;
   background: #2C3E50;
   border-radius: 20px;
   box-shadow: 5px 5px 10px rgba(71, 85, 110, 0.9);

}

@keyframes animation{
  from {
    height: 0;
  }
  to {
    height: auto; /* Define a altura máxima que o menu pode alcançar */
  }
}


.logout-link {
  cursor: pointer;
}



.menu-usuario, .menu-usuario2{
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 0 10px;
  margin-bottom: 10px;
  align-items: center;
}

.menu-usuario:last-child, 
.menu-usuario2:last-child{
    margin-bottom: 0 ;
    
}

.header-bg{
    background-color:#F5F1E9 ;
    width: 100%;
    padding-top: 40px;
    height: 100px;
}

.header{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;  
    position: relative;

}

.header-menu{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    margin-left: 50px;
    font-size: 0.9rem;
    margin-top: -9px;
    font-family: "Open Sans", sans-serif;
    text-transform: uppercase;
}

.header-menu a{
    color: #2C3E50;
    padding: 5px;
}

.header-btn{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-right: 50px;
    margin-top: -7px;
    gap: 20px;
  
}

.logo{
    position: absolute; /* Fixa a logo ao centro da tela */
    left: 50%;
    transform: translateX(-50%); /* Centraliza a logo */
     margin-top: -30px;
}

.btn-login, .btn-cadastro{
    padding: 16px 32px;
    font-family: "Open Sans";
    font-size: 0.9rem;
    border-radius: 30px;
    max-width: max-content;
    border: none;
    text-transform: uppercase;
}

.btn-login{
    background-color: #D6EAF8;
    color: #2C3E50;
}

.btn-login:hover{
    background: linear-gradient( #D6EAF8, #6798C0  );
}

.btn-cadastro{
    background-color: #2C3E50;
    color: #D6EAF8;
}

.btn-cadastro:hover{
    background: linear-gradient(#2C3E50, #648db6);
}


</style>
