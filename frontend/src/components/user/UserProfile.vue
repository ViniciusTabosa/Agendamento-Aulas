<template>
  <div class="user-profile-container">
    <!-- Menu Lateral -->
    <div class="menu-lateral">
      <ul>
        <li :class="{ active: section === 'profile' }" @click="section = 'profile'">Perfil</li>
        <li :class="{ active: section === 'personal' }" @click="section = 'personal'">Alterar Dados Pessoais</li>
        <li :class="{ active: section === 'password' }" @click="section = 'password'">Alterar Senha</li>
        <li :class="{ active: section === 'email' }" @click="section = 'email'">Alterar E-mail</li>
      </ul>
    </div>

    <!-- Conteúdo Principal -->
    <div class="conteudo">
      <!-- Seção de Perfil -->
      <div v-if="section === 'profile'" class="profile-section">
        <h2>Perfil</h2>
        <p v-if="user"><strong>Nome:</strong> {{ user.nome }}</p>
        <p v-if="user"><strong>Sobrenome:</strong> {{ user.sobrenome }}</p>
        <p v-if="user"><strong>CPF:</strong> {{ user.cpf }}</p>
        <p v-if="user"><strong>E-mail:</strong> {{ user.email }}</p>
      </div>

      <!-- Seção de Alteração de Dados Pessoais -->
      <div v-if="section === 'personal'" class="personal-section">
        <h2>Alterar Dados Pessoais</h2>
        <form @submit.prevent="updatePersonalInfo">
          <div class="form-group">
            <label for="nome">Nome</label>
            <input v-model="updatedInfo.nome" id="nome" placeholder="Nome" />
          </div>
          <div class="form-group">
            <label for="sobrenome">Sobrenome</label>
            <input v-model="updatedInfo.sobrenome" id="sobrenome" placeholder="Sobrenome" />
          </div>
          <div class="action-buttons">
            <button type="submit" class="save-btn">Atualizar</button>
            <button type="button" @click="cancelUpdate" class="cancel-btn">Cancelar</button>
          </div>
        </form>
      </div>

      <!-- Seção de Alteração de Senha -->
      <div v-if="section === 'password'" class="password-section">
        <h2>Alterar Senha</h2>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label for="senhaAtual">Senha Atual</label>
            <input v-model="passwordInfo.senhaAtual" type="password" id="senhaAtual" placeholder="Senha Atual" />
          </div>
          <div class="form-group">
            <label for="novaSenha">Nova Senha</label>
            <input v-model="passwordInfo.novaSenha" type="password" id="novaSenha" placeholder="Nova Senha" />
          </div>
          <button type="submit" class="save-btn">Alterar Senha</button>
        </form>
      </div>

      <!-- Seção de Alteração de E-mail -->
      <div v-if="section === 'email'" class="email-section">
        <h2>Alterar E-mail</h2>
        <form @submit.prevent="changeEmail">
          <div class="form-group">
            <label for="novoEmail">Novo E-mail</label>
            <input v-model="emailInfo.novoEmail" id="novoEmail" type="email" placeholder="Novo E-mail" />
          </div>
          <button type="submit" class="save-btn">Enviar Código de Confirmação</button>
        </form>
      </div>
    </div>

    <!-- Popup/Modal de Confirmação de Código -->
    <div v-if="showConfirmation" class="modal-overlay">
      <div class="modal-content">
        <h2>Digite o Código de Confirmação</h2>
        <input v-model="emailInfo.codigoConfirmacao" type="text" placeholder="Código de Confirmação" />
        <div class="modal-actions">
          <button @click="confirmEmail" class="save-btn">Confirmar</button>
          <button @click="closeModal" class="cancel-btn">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/api';

export default {
  data() {
    return {
      section: 'profile',
      user: null,
      updatedInfo: {
        nome: '',
        sobrenome: '',
      },
      passwordInfo: {
        senhaAtual: '',
        novaSenha: '',
      },
      emailInfo: {
        novoEmail: '',
        codigoConfirmacao: '',
      },
      showConfirmation: false,
    };
  },
  async created() {
    await this.loadUserProfile();
  },
  watch: {
    // Observa mudanças na seção selecionada
    section(newSection) {
      if (newSection === 'profile') {
        this.loadUserProfile();
      }
    },
  },
  methods: {
    async loadUserProfile() {
      try {
        const userId = sessionStorage.getItem('usuarioId');
        const response = await axios.get(`/usuarios/${userId}`);
        this.user = response.data;
        this.updatedInfo.nome = this.user.nome;
        this.updatedInfo.sobrenome = this.user.sobrenome;
      } catch (error) {
        console.error('Erro ao carregar o perfil do usuário:', error);
      }
    },
    async updatePersonalInfo() {
      try {
        const userId = sessionStorage.getItem('usuarioId');
        await axios.put(`/usuarios/atualizar-informacoes/${userId}`, {
          nome: this.updatedInfo.nome,
          sobrenome: this.updatedInfo.sobrenome,
        });
        alert('Dados atualizados com sucesso!');
        // Atualiza o objeto user com os novos dados
        this.user.nome = this.updatedInfo.nome;
        this.user.sobrenome = this.updatedInfo.sobrenome;
      } catch (error) {
        alert('Erro ao atualizar os dados pessoais.');
      }
    },
    cancelUpdate() {
      this.updatedInfo = { nome: this.user.nome, sobrenome: this.user.sobrenome };
    },
    async changePassword() {
      try {
        const userId = sessionStorage.getItem('usuarioId');
        await axios.put(`/usuarios/alterar-senha/${userId}`, {
          senhaAtual: this.passwordInfo.senhaAtual,
          novaSenha: this.passwordInfo.novaSenha,
        });
        alert('Senha alterada com sucesso!');
        // Limpar campos de senha
        this.passwordInfo.senhaAtual = '';
        this.passwordInfo.novaSenha = '';
      } catch (error) {
        alert('Erro ao alterar a senha.');
      }
    },
    async changeEmail() {
      try {
        const userId = sessionStorage.getItem('usuarioId');
        await axios.post(`/usuarios/enviar-codigo-confirmacao/${userId}`, {
          novoEmail: this.emailInfo.novoEmail,
        });
        alert('Código de confirmação enviado!');
        this.showConfirmation = true;
      } catch (error) {
        alert('Erro ao enviar código.');
      }
    },
    async confirmEmail() {
      try {
        const userId = sessionStorage.getItem('usuarioId');
        await axios.post(`/usuarios/confirmar-codigo-email/${userId}`, {
          codigoConfirmacao: this.emailInfo.codigoConfirmacao,
        });
        alert('E-mail alterado com sucesso!');
        this.closeModal();
        // Atualiza o objeto user com o novo e-mail
        this.user.email = this.emailInfo.novoEmail;
        // Limpar campos de e-mail
        this.emailInfo.novoEmail = '';
        this.emailInfo.codigoConfirmacao = '';
      } catch (error) {
        alert('Código de confirmação incorreto.');
      }
    },
    closeModal() {
      this.showConfirmation = false;
    },
  },
};
</script>

<style scoped>
.user-profile-container {
  display: flex;
  max-width: 1000px;
  margin: 120px auto;
  background-color: #F5F1E9;
  border-radius: 10px;
  box-shadow: 0 4px 8px #2c3e5062;
  padding: 20px;
}

.menu-lateral {
  font-family: "Open Sans", sans-serif;
  text-align: center;
  width: 200px;
  border-right: 1px solid #ddd;
  padding: 20px;
}

.menu-lateral ul {
  list-style: none;
  padding: 0;
  
}

.menu-lateral li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s ease;
  border-radius: 10px;
}

.menu-lateral li.active,
.menu-lateral li:hover {
  background-color: #2C3E50;
  color: white;
  border-radius: 10px;
}


.conteudo {
  font-family: "Open Sans", sans-serif;
  text-align: center;
  flex-grow: 1;
  padding: 20px;
}

.profile-section{
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.conteudo h2{
  font-family: "Bebas Neue", sans-serif;
  font-weight: 400;
  font-style: normal;
  color: #2C3E50;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #000;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #D6EAF8;
  border-radius: 10px;
}

.save-btn,
.cancel-btn {
<<<<<<< HEAD
  color: #fff;
  background-color: #2C3E50;
  padding: 10px 20px;
  border-radius: 10px;
=======
  color: #D6EAF8;
  background-color: #2C3E50;
  padding: 10px 20px;
  border-radius: 30px;
>>>>>>> ada387601d722e0b698f48357620328be25188da
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;
  text-transform: uppercase;
}

.save-btn:hover {
  color: #fff;
  background: linear-gradient(#2C3E50, #648db6);
}

.cancel-btn {
  background-color: #D6EAF8;
  color: #000;
}

.cancel-btn:hover {
  background-color: #e47d7d;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Estilos do modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
