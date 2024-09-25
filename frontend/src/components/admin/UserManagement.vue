<template>
  <div class="usuarios-container">
    
    <div class="title-container">
      <h1 class="title">Gerenciamento de Usuários</h1>
      <button @click="abrirModalNovoUsuario" class="btn" style="margin-left: 5px;">Novo Usuário</button>
    </div>   

    <!-- Input de Busca -->
    <div class="search-box">
      <input
        type="text"
        v-model="searchQuery"
        @input="buscarUsuario"
        placeholder="Digite o e-mail ou CPF do usuário"
        class="search-input"
      />

      <!-- Dropdown para seleção de perfil -->
      <select v-model="selectedPerfil" @change="buscarUsuario" class="filter-select">
        <option value="">Todos os Perfis</option>
        <option v-for="perfil in perfis" :key="perfil._id" :value="perfil._id">{{ perfil.nome }}</option>
      </select>

      <button @click="resetarFiltro" class="btn-reset">Resetar Filtro</button>      
      
    </div>

    <!-- Tabela de Usuários -->
    <div class="table-wrapper">
      <table class="user-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>CPF</th>
            <th>Perfil</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario._id">
            <td>{{ usuario.nome }} {{ usuario.sobrenome }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ formatarCPF(usuario.cpf) }}</td>
            <td>{{ usuario.perfilId?.nome }}</td>
            <td class="actions">
              <span @click="verUsuario(usuario)" class="action-icon">
                <i class="fas fa-eye"></i>
              </span>
              <span @click="editarUsuario(usuario)" class="action-icon">
                <i class="fas fa-edit"></i>
              </span>
              <span @click="deletarUsuario(usuario._id)" class="action-icon">
                <i class="fas fa-trash-alt"></i>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Componente de Paginação -->
    <PaginationComponent
      :paginaAtual="paginaAtual"
      :totalPaginas="totalPaginas"
      :totalRegistros="totalUsuarios"
      :registrosPorPagina="usuariosPorPagina"
      @pagina-trocada="paginaAtual = $event; buscarUsuarios(false)"
    />

    <!-- Modal para visualizar o usuário -->
    <div v-if="verModal" class="modal">
      <div class="modal-content">
        <h2>Detalhes do Usuário</h2>
        <p><strong>Nome:</strong> {{ usuarioSelecionado.nome }} {{ usuarioSelecionado.sobrenome }}</p>
        <p><strong>E-mail:</strong> {{ usuarioSelecionado.email }}</p>
        <p><strong>CPF:</strong> {{ formatarCPF(usuarioSelecionado.cpf) }}</p>
        <p><strong>Perfil:</strong> {{ usuarioSelecionado.perfilId?.nome }}</p>
        <button @click="fecharModal" class="btn">Fechar</button>
      </div>
    </div>

    <!-- Modal para editar o usuário -->
    <div v-if="editarModal" class="modal">
      <div class="modal-content">
        <h2>Editar Usuário</h2>
        <input v-model="usuarioEditando.nome" placeholder="Nome" class="input-field" />
        <input v-model="usuarioEditando.sobrenome" placeholder="Sobrenome" class="input-field" />
        <input v-model="usuarioEditando.email" placeholder="E-mail" class="input-field" />
        <input v-model="usuarioEditando.cpf" @input="usuarioEditando.cpf = formatarCPF(usuarioEditando.cpf)" placeholder="CPF" class="input-field"/>
        <input v-model="usuarioEditando.senha" placeholder="Senha" class="input-field" type ="password" />
        <select v-model="usuarioEditando.perfilId" class="input-field">
          <option v-for="perfil in perfis" :key="perfil._id" :value="perfil._id">{{ perfil.nome }}</option>
        </select>
        <button @click="salvarEdicao" class="btn btn-save" style="margin-right: 10px;">Salvar</button>
        <button @click="fecharModal" class="btn btn-cancel">Cancelar</button>
      </div>
    </div>

    <!-- Modal para adicionar novo usuário -->
    <div v-if="novoUsuarioModal" class="modal">
      <div class="modal-content">
        <h2>Novo Usuário</h2>
        <input v-model="novoUsuario.nome" placeholder="Nome" class="input-field" />
        <input v-model="novoUsuario.sobrenome" placeholder="Sobrenome" class="input-field" />
        <input v-model="novoUsuario.email" placeholder="E-mail" class="input-field" />
        <input v-model="novoUsuario.cpf" @input="novoUsuario.cpf = formatarCPF(novoUsuario.cpf)" placeholder="CPF" class="input-field" />
        <input v-model="novoUsuario.senha" placeholder="Senha" class="input-field" type="password" />
        <select v-model="novoUsuario.perfilId" class="input-field">
          <option v-for="perfil in perfis" :key="perfil._id" :value="perfil._id">{{ perfil.nome }}</option>
        </select>
        <button @click="salvarNovoUsuario" class="btn btn-save" style="margin-right: 10px;">Salvar</button>
        <button @click="fecharModalNovoUsuario" class="btn btn-cancel">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import PaginationComponent from '@/components/shared/Pagination.vue';
import api from "@/utils/api"; 

export default {
  name: 'UserManagementComponent',
  components: {
    PaginationComponent,
  },
  data() {
    return {
      usuarios: [],
      perfis: [],
      searchQuery: "",
      selectedPerfil: "",
      paginaAtual: 1,
      totalPaginas: 0,
      totalUsuarios: 0,
      usuariosPorPagina: 10,
      verModal: false,
      editarModal: false,
      novoUsuarioModal: false,
      usuarioSelecionado: {},
      usuarioEditando: { perfilId: '' },
      novoUsuario: { nome: '', sobrenome: '', email: '', cpf: '', perfilId: '' },
    };
  },
  methods: {
    // Função para buscar usuários
    async buscarUsuario(resetPage = true) {
      try {

        if (resetPage) {
          this.paginaAtual = 1; // Reseta a página atual para 1 ao fazer uma nova busca
        }

        // Reseta os contadores e resultados antes de realizar a busca
        this.usuarios = [];
        this.totalUsuarios = 0;
        this.totalPaginas = 0;

        const queryParam = `?pagina=${this.paginaAtual}&usuariosPorPagina=${this.usuariosPorPagina}`;
        const searchParam = this.searchQuery ? `&searchQuery=${encodeURIComponent(this.searchQuery)}` : '';
        const perfilParam = this.selectedPerfil ? `&perfilId=${this.selectedPerfil}` : '';
  
        const response = await api.get(`/usuarios${queryParam}${searchParam}${perfilParam}`);
        
        this.usuarios = response.data.usuarios;
        this.totalUsuarios = response.data.totalUsuarios;
        this.totalPaginas = Math.ceil(this.totalUsuarios / this.usuariosPorPagina);

      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    },

    // Resetar o filtro de busca
    resetarFiltro() {
      this.searchQuery = "";
      this.selectedPerfil = "";
      this.paginaAtual = 1;
      this.buscarUsuario();
    },

    // Ver usuário
    verUsuario(usuario) {
      this.usuarioSelecionado = usuario;
      this.verModal = true;
    },

    // Editar usuário
    editarUsuario(usuario) {
      this.usuarioEditando = { ...usuario };
      // Formatar o CPF do usuário que vem do banco de dados ao abrir o modal de edição
      this.usuarioEditando.cpf = this.formatarCPF(this.usuarioEditando.cpf);
      this.editarModal = true;
    },

    // Função para salvar a edição
    async salvarEdicao() {
      if (!this.validarCPF(this.usuarioEditando.cpf)) {
        alert('CPF inválido!');
        return;
      }
      try {
        const cpfSemMascara = this.removerMascaraCPF(this.usuarioEditando.cpf);
        await api.put(`/usuarios/atualizar-informacoes/${this.usuarioEditando._id}`, {
          nome: this.usuarioEditando.nome,
          sobrenome: this.usuarioEditando.sobrenome,
          email: this.usuarioEditando.email,
          cpf: cpfSemMascara,
          senha: this.usuarioEditando.senha,
          perfilId: this.usuarioEditando.perfilId,
        });
        this.editarModal = false;
        this.buscarUsuario();
      } catch (error) {
        console.error('Erro ao salvar a edição:', error);
      }
    },

    // Abrir modal para novo usuário
    abrirModalNovoUsuario() {
      this.novoUsuarioModal = true;
      this.novoUsuario = { nome: '', sobrenome: '', email: '', cpf: '', perfilId: '' };
    },

    // Fechar modal para novo usuário
    fecharModalNovoUsuario() {
      this.novoUsuarioModal = false;
    },

    // Salvar novo usuário
    async salvarNovoUsuario() {
      if (!this.validarCPF(this.novoUsuario.cpf)) {
        alert('CPF inválido!');
        return;
      }
      try {
        const cpfSemMascara = this.removerMascaraCPF(this.novoUsuario.cpf);
        await api.post("/usuarios", {
          nome: this.novoUsuario.nome,
          sobrenome: this.novoUsuario.sobrenome,
          email: this.novoUsuario.email,
          cpf: cpfSemMascara,
          senha: this.novoUsuario.senha,
          perfilId: this.novoUsuario.perfilId,
        });
        this.fecharModalNovoUsuario();
        this.buscarUsuario();
      } catch (error) {
        console.error("Erro ao salvar novo usuário:", error);
      }
    },

    // Função para deletar usuário
    async deletarUsuario(id) {
      if (confirm("Você tem certeza que deseja deletar este usuário?")) {
        try {
          await api.delete(`/usuarios/${id}`);
          this.buscarUsuario();
        } catch (error) {
          console.error("Erro ao deletar o usuário:", error);
        }
      }
    },

    // Fechar modais
    fecharModal() {
      this.verModal = false;
      this.editarModal = false;
    },

    // Formatar CPF com máscara
    formatarCPF(cpf) {
      // Limitar a entrada a no máximo 11 números
      cpf = cpf.replace(/\D/g, '').slice(0, 11); // Remove tudo que não é número e limita a 11 dígitos

      if (cpf.length > 3) cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      if (cpf.length > 6) cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      if (cpf.length > 9) cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

      return cpf;
    },

    // Remover máscara de CPF
    removerMascaraCPF(cpf) {
      return cpf.replace(/\D/g, ''); // Remove tudo que não é número
    },

    // Validar CPF
    validarCPF(cpf) {
      cpf = this.removerMascaraCPF(cpf);
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false; // CPF inválido se todos os números forem iguais ou se tiver menos de 11 dígitos
      }
      let soma = 0;
      let resto;
      for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.substring(9, 10))) return false;
      soma = 0;
      for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.substring(10, 11))) return false;
      return true;
    },
  },
  mounted() {
    this.buscarUsuario();
    api.get("/perfis").then((response) => {
      this.perfis = response.data;
    });
  },
};
</script>

<style scoped>
.usuarios-container {
  min-height: calc(100vh - 100px); /* Calcula a altura da viewport menos o tamanho do header e footer */
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 0 auto;
  position: relative;
  background-color: #FFFFFF;
}

.title-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.title {
  font-family: 'Bebas Neue', sans-serif;
  color: #2C3E50;
  font-size: 2.5rem;
}

.novo-usuario-btn {
  background-color: #2C3E50;
  color: white;
  padding: 16px 32px;
  border-radius: 25px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.novo-usuario-btn:hover {
  background-color: #1F2C3C;
}

.search-box {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-bottom: 20px;

}

.search-input,
.filter-select {
  font-family: 'Open Sans', sans-serif;
  width: 30%;
  padding: 12px 16px;
  border: 2px solid #D6EAF8;
  border-radius: 25px;
  font-size: 16px;
  color: #2F2F2F;
  margin-right: 10px;
}

.btn {
  background-color: #2C3E50;
  color: white;
  padding: 16px 32px;
  border-radius: 25px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #1F2C3C;
}

.btn-reset {
  background-color: #F1C40F; 
  color: #2C3E50; 
  padding: 12px 24px; 
  border-radius: 25px; 
  font-weight: bold; 
  border: 2px solid #bcddff; 
  cursor: pointer; 
  transition: background-color 0.3s ease, color 0.3s ease; 
}

.btn-reset:hover {
  background-color: #d3ad04; 

}


.table-wrapper {
  overflow-x: auto;
  margin-top: 20px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
}

.user-table th,
.user-table td {
  padding: 10px;
  border: 1px solid #e2e8f0;
  text-align: left;
}

.user-table th {
  background-color: #2C3E50;
  color: white;
  padding: 10px;
  text-align: center; /* Centraliza o conteúdo do cabeçalho */
}

.user-table td {
  color: #2F2F2F;
}



.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.action-icon {
  cursor: pointer;
  font-size: 1.2rem;
  color: #F1C40F; /* Cor de destaque */
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

.modal-content h2 {
  font-family: "Bebas Neue", sans-serif;
  font-size: 1.8rem;
  color: #2C3E50;
  margin-bottom: 20px;
}

/* Botões específicos dos modais */
.btn-save {
  background-color: #2ECC71; /* Verde */
}

.btn-save:hover {
  background: linear-gradient(#2ECC71, #28B463);
}

.btn-cancel {
  background-color: #E74C3C; /* Vermelho */
}

.btn-cancel:hover {
  background: linear-gradient(#E74C3C, #C0392B);
}

.input-field {
  display: block;
  width: 95%;
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid #D6EAF8;
  border-radius: 5px;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
}
</style>
