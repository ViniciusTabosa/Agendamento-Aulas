<template>
  <div class="confirm-account-container">
    <h2>Confirmação de Conta</h2>
    <p v-if="loading">Confirmando sua conta, por favor aguarde...</p>
    <p v-if="successMessage" class="success">{{ successMessage }} Você será redirecionado para a página de login em {{ countdown }} segundos.</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from '@/utils/api';

export default {
  name: 'ConfirmAccountComponent',
  data() {
    return {
      loading: true,
      successMessage: '',
      errorMessage: '',
      countdown: 5, // Contador para o redirecionamento
    };
  },
  async created() {
    const token = this.$route.params.token; // Obtém o token da URL
    try {
      await axios.get(`/account/confirm-account/${token}`);
      this.successMessage = 'Conta confirmada com sucesso! Agora você pode fazer login.';
      this.loading = false;
      this.startCountdown(); // Inicia o contador
    } catch (error) {
      this.errorMessage = 'Erro ao confirmar a conta. Verifique o link ou tente novamente.';
      this.loading = false;
    }
  },
  methods: {
    startCountdown() {
      const interval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(interval);
          this.$router.push('/login'); // Redireciona para a página de login após 5 segundos
        }
      }, 1000); // Reduz o contador a cada 1 segundo
    },
  },
};
</script>

<style scoped>
.confirm-account-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h2 {
  color: #644fc1; /* Cor violeta padrão */
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
