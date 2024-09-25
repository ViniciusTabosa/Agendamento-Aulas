<template>
  <div class="reset-password-container">
    <h2>Redefinir Senha</h2>
    <form @submit.prevent="handleResetPassword">
      <div class="form-group">
        <label for="password">Nova Senha</label>
        <input v-model="password" type="password" id="password" placeholder="Digite sua nova senha" required />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmar Nova Senha</label>
        <input v-model="confirmPassword" type="password" id="confirmPassword" placeholder="Confirme sua nova senha" required />
      </div>

      <button type="submit" class="submit-btn">Redefinir Senha</button>
    </form>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from '@/utils/api';

export default {
  name: 'ResetPasswordComponent',
  data() {
    return {
      password: '',
      confirmPassword: '',
      message: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleResetPassword() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'As senhas não coincidem.';
        return;
      }

      try {
        const token = this.$route.params.token; // Obter o token da rota
        await axios.post(`/password/reset-password/${token}`, { senha: this.password });
        this.message = 'Senha redefinida com sucesso!';
        this.errorMessage = '';
        // Redirecionar o usuário para a página de login após o envio
        this.$router.push('/login');
      } catch (error) {
        this.errorMessage = 'Erro ao redefinir a senha. Tente novamente.';
        this.message = '';
      }
    },
  },
};
</script>

<style scoped>
.reset-password-container {
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h2 {
  font-family: "Bebas Neue", sans-serif;
  font-size: 2rem;
  color: #2C3E50;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

form {
  background-color: #F5F1E9;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 5px 5px 20px rgba(71, 94, 136, 0.9);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-family: "Open Sans", sans-serif;
  font-size: 1rem;
  margin-bottom: 5px;
  color: #2C3E50;
}

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

.submit-btn {
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

.submit-btn:hover {
  background: linear-gradient(#F1C40F, #e6760e);
}

.success {
  margin-top: 20px;
  color: green;
  font-family: "Open Sans", sans-serif;
  font-size: 1rem;
}

.error {
  margin-top: 20px;
  color: red;
  font-family: "Open Sans", sans-serif;
  font-size: 1rem;
}
</style>
