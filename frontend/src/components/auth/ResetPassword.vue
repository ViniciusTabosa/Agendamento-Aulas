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
  width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fbfaff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
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

.submit-btn {
  background-color: #6e56cf;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  width: 100%;
}

.submit-btn:hover {
  background-color: #644fc1;
}

.success {
  color: green;
  text-align: center;
  margin-top: 10px;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
