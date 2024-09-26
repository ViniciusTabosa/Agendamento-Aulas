<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">E-mail</label>
        <input v-model="email" type="email" id="email" placeholder="E-mail" required />
      </div>

      <div class="form-group">
        <label for="senha">Senha</label>
        <input v-model="senha" type="password" id="senha" placeholder="Senha" required />
      </div>

      <button type="submit" class="login-btn">Entrar</button>

      <p class="forgot-password">
        <router-link to="/forgot-password">Esqueceu sua senha?</router-link>
      </p>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
  import { useAuthStore } from '@/store/auth';

  export default {
    name: 'LoginComponent',
    data() {
      return {
        email: '',
        senha: '',
        errorMessage: '',
      };
    },
    methods: {
      async handleLogin() {
        try {
          const authStore = useAuthStore();
          await authStore.login({ email: this.email, senha: this.senha });

          // Verificar se há uma rota de redirecionamento na query string ou redirecionar para /admin
          const redirectTo = this.$route.query.redirect || '/admin';
          this.$router.push(redirectTo);
        } catch (error) {
          this.errorMessage = 'E-mail ou senha incorretos';
        }
      }
    }
  };
</script>

<style scoped>
/* Container do login */
.login-container {
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Título do login */
h1 {
  font-family: "Bebas Neue", sans-serif;
  font-size: 2.5rem;
  color: #2C3E50;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

/* Estilo do formulário */
form {
  background-color: #F5F1E9;
  padding: 40px;
  width: 400px;
  border-radius: 15px;
  box-shadow: 5px 5px 20px rgba(71, 94, 136, 0.9);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Agrupamento dos inputs */
.form-group {
  display: flex;
  flex-direction: column;
}

/* Labels dos inputs */
label {
  font-family: "Open Sans", sans-serif;
  font-size: 1rem;
  margin-bottom: 5px;
  color: #2C3E50;
}

/* Inputs do formulário */
input {
  width: 100%;
  height: 35px;
  padding: 10px;
  border: none;
  border-radius: 15px;
  background-color: #EBE8E1;
  font-family: "Open Sans", sans-serif;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border: 2px solid #F1C40F;
}

/* Botão de login */
.login-btn {
  padding: 16px 32px;
  font-family: "Open Sans", sans-serif;
  font-size: 0.9rem;
  background-color: #F1C40F;
  color: #2C3E50;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  text-transform: uppercase;
}

.login-btn:hover {
  background: linear-gradient(#F1C40F, #e6760e);
}

/* Link para recuperação de senha */
.forgot-password {
  margin-top: 10px;
}

.forgot-password a {
  color: #025b9b;
  text-decoration: none;
  font-family: "Open Sans", sans-serif;
  font-size: 0.9rem;
}

.forgot-password a:hover {
  color: #6798C0;
}

/* Mensagem de erro */
.error {
  margin-top: 20px;
  color: red;
  font-family: "Open Sans", sans-serif;
  font-size: 1rem;
}
</style>