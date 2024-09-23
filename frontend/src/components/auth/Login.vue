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
.login-container {
  width: 350px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fbfaff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #644fc1;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
  margin-right: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  text-align: left;
  color: #5746af;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #d7cff9;
  font-size: 14px;
}

.login-btn {
  background-color: #6e56cf;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  width: 100%;
}

.login-btn:hover {
  background-color: #644fc1;
}

.forgot-password {
  text-align: center;
  margin-top: 10px;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
