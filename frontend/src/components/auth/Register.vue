<template>
  <div class="register-container">
    <h2>Criação de Conta</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="nome">Nome</label>
        <input v-model="nome" type="text" id="nome" placeholder="Digite seu nome" required />
      </div>

      <div class="form-group">
        <label for="sobrenome">Sobrenome</label>
        <input v-model="sobrenome" type="text" id="sobrenome" placeholder="Digite seu sobrenome" required />
      </div>

      <div class="form-group">
        <label for="email">E-mail</label>
        <input v-model="email" type="email" id="email" placeholder="Digite seu e-mail" required />
      </div>

      <div class="form-group">
        <label for="cpf">CPF</label>
        <input v-model="cpf" type="text" id="cpf" placeholder="Digite seu CPF" required />
      </div>

      <div class="form-group">
        <label for="senha">Senha</label>
        <input v-model="senha" type="password" id="senha" placeholder="Digite sua senha" required />
      </div>

      <button type="submit" class="submit-btn">Criar Conta</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="message" class="success">{{ message }}</p>
  </div>
</template>

<script>
import axios from '@/utils/api';

export default {
  name: 'RegisterComponent',
  data() {
    return {
      nome: '',
      sobrenome: '',
      email: '',
      cpf: '',
      senha: '',
      errorMessage: '',
      message: '',
    };
  },
  methods: {
    async handleRegister() {
      try {
        // Buscar o perfil "002" (usuário comum)
        const perfilResponse = await axios.get('/perfis/code/002');
        const perfilId = perfilResponse.data._id;

        // Fazer a requisição de criação de conta com o perfilId
        await axios.post('/register', {
          nome: this.nome,
          sobrenome: this.sobrenome,
          email: this.email,
          cpf: this.cpf,
          senha: this.senha,
          perfilId: perfilId,
        });

        this.message = 'Conta criada com sucesso! Verifique seu e-mail para confirmar sua conta.';
        this.errorMessage = '';
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error || 'Erro desconhecido.');
        } else {
          this.errorMessage = 'Erro ao criar a conta. Verifique os dados e tente novamente.';
          this.message = '';
        }
      }
    },
  },
};
</script>

<style scoped>
.register-container {
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
