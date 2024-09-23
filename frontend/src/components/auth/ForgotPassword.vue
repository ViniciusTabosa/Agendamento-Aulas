<template>
  <div class="forgot-password-container">
    <h2>Recuperação de Senha</h2>
    <form @submit.prevent="handleForgotPassword">
      <div class="form-group">
        <label for="email">E-mail</label>
        <input v-model="email" type="email" id="email" placeholder="Digite seu e-mail" required />
      </div>
      <button type="submit" class="submit-btn">Enviar</button>
    </form>
    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from '@/utils/api';

export default {
  name: 'ForgotPasswordComponent',
  data() {
    return {
      email: '',
      message: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleForgotPassword() {
      try {
        const response = await axios.post('/password/forgot-password', { email: this.email });
        this.message = response.data.message;
        this.errorMessage = '';
        // Redirecionar o usuário para a página de login após o envio
        this.$router.push('/login');
      } catch (error) {
        this.errorMessage = 'Erro ao enviar o e-mail. Verifique o endereço de e-mail e tente novamente.';
        this.message = '';
      }
    },
  },
};
</script>

<style scoped>
.forgot-password-container {
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
