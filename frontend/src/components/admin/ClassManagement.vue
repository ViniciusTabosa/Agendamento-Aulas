<template>
  <div class="aulas-container">
    <!-- Botão para adicionar nova aula -->
    <div class="title-container">
      <h1 class="title">Gerenciamento de Aulas</h1>
      <button @click="abrirModalNovaAula" class="btn" style="margin-left: 5px;">Nova Aula</button>

    </div>   

    <!-- Input de Busca e Filtro por Categoria -->
    <div class="filters">
      <input
        type="text"
        v-model="searchQuery"
        @input="buscarAulas"
        placeholder="Digite o nome da aula"
        class="search-input"
      />
      <select v-model="selectedCategoria" @change="buscarAulas" class="filter-select">
        <option value="">Todas as Categorias</option>
        <option v-for="categoria in categorias" :key="categoria._id" :value="categoria._id">
          {{ categoria.nome }}
        </option>
      </select>
      <button @click="resetarFiltros" class="btn btn-reset">Resetar Filtro</button>
    </div>

    <!-- Tabela de Aulas -->
    <div class="table-wrapper">
      <table class="class-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Instrutor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="aula in aulas" :key="aula._id">
            <td>{{ aula.nome }}</td>
            <td>{{ aula.descricao }}</td>
            <td>{{ aula.categoriaId?.nome }}</td>
            <td>{{ aula.instrutorId?.nome }} {{ aula.instrutorId?.sobrenome }}</td>
            <td class="actions">
              <span @click="verAula(aula)" class="action-icon">
                <i class="fas fa-eye"></i>
              </span>
              <span @click="editarAula(aula)" class="action-icon">
                <i class="fas fa-edit"></i>
              </span>
              <span @click="abrirModalHorarios(aula)" class="action-icon">
                <i class="fas fa-clock"></i>
              </span>
              <span @click="excluirAula(aula._id)" class="action-icon">
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
      :totalRegistros="totalAulas"
      :registrosPorPagina="aulasPorPagina"
      @pagina-trocada="paginaAtual = $event; buscarAulas(false)"
    />
  </div>

    <!-- Modal para visualizar aula -->
    <div v-if="verModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Detalhes da Aula</h2>
        </div>
        <div class="modal-p">
          <p><span>Nome:</span>{{ aulaSelecionada.nome }}</p>
          <p><span>Descrição:</span>{{ aulaSelecionada.descricao }}</p>
          <p><span>Duração:</span>{{ aulaSelecionada.duracao }} {{ aulaSelecionada.duracao > 1 ? 'horas' : 'hora' }}</p>
          <p><span>Categoria:</span>{{ aulaSelecionada.categoriaId?.nome }}</p>
          <p><span>Instrutor:</span>{{ aulaSelecionada.instrutorId?.nome }} {{ aulaSelecionada.instrutorId?.sobrenome }}</p>
        </div>
        <button @click="fecharModal" class="btn-cancel">Fechar</button>
      </div>
    </div>

    <!-- Modal para editar aula -->
    <div v-if="editarModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Editar Aula</h2>
        </div>
        <input v-model="aulaEditando.nome" placeholder="Nome" class="input-field" />
        <textarea v-model="aulaEditando.descricao" placeholder="Descrição" class="input-field"></textarea>
        <input v-model="aulaEditando.duracao" placeholder="Duração (horas)" class="input-field" />
        <select v-model="aulaEditando.categoriaId" class="input-field">
          <option v-for="categoria in categorias" :key="categoria._id" :value="categoria._id">
            {{ categoria.nome }}
          </option>
        </select>
        <select v-model="aulaEditando.instrutorId" class="input-field">
          <option v-for="instrutor in instrutores" :key="instrutor._id" :value="instrutor._id">
            {{ instrutor.nome }} {{ instrutor.sobrenome }}
          </option>
        </select>
        <button @click="salvarEdicao" class="btn-save" style="margin-right: 10px;">Salvar</button>
        <button @click="fecharModal" class="btn-cancel">Cancelar</button>
      </div>
    </div>

    <!-- Modal para adicionar nova aula -->
    <div v-if="novaAulaModal" class="modal">
      <div class="modal-content">
        <h2>Nova Aula</h2>
        <input v-model="novaAula.nome" placeholder="Nome" class="input-field" />
        <textarea v-model="novaAula.descricao" placeholder="Descrição" class="input-field"></textarea>
        <input v-model="novaAula.duracao" placeholder="Duração (horas)" class="input-field" />
        <select v-model="novaAula.categoriaId" class="input-field">
          <option value="">-- Categoria --</option>
          <option v-for="categoria in categorias" :key="categoria._id" :value="categoria._id">
            {{ categoria.nome }}
          </option>
        </select>
        <select v-model="novaAula.instrutorId" class="input-field">
        <option value="">-- Instrutor(a) --</option>
          <option v-for="instrutor in instrutores" :key="instrutor._id" :value="instrutor._id">
            {{ instrutor.nome }} {{ instrutor.sobrenome }}
          </option>
        </select>
        <button @click="salvarNovaAula" class="btn-save" style="margin-right: 10px;">Salvar</button>
        <button @click="fecharModalNovaAula" class="btn-cancel">Cancelar</button>
      </div>
    </div>

  <!-- Modal para gerenciar horários -->
      <div v-if="modalHorarios" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Horários: {{ aulaSelecionada.nome }}</h2>
            <i @click="fecharModalHorarios" class="fas fa-times" style="color: red; cursor: pointer; font-size: 1.5em"></i>
          </div>

          <!-- Select para dias da semana -->
          <select v-model="selectedDay" @change="filtrarHorariosPorDia" class="input-field">
            <option value="">-- Selecione um dia --</option>
            <option v-for="(dia, index) in diasSemana" :key="index" :value="index">{{ dia }}</option>
          </select>

          <!-- Lista de horários -->
          <div v-if="selectedDay !== '' && horariosFiltrados.length > 0">
            <div v-for="horario in horariosFiltrados" :key="horario._id">
              <div class="horario-edit-container">
                <input 
                  type="time" 
                  v-model="horario.hora_inicio" 
                  placeholder="Hora Início" 
                  class="input-field" 
                  :disabled="!isEditing" 
                />
                <span> às </span>
                <input 
                  type="time" 
                  v-model="horario.hora_fim" 
                  placeholder="Hora Fim" 
                  class="input-field" 
                  :disabled="!isEditing" 
                />

                <!-- Botões Salvar e Cancelar aparecem apenas durante a edição -->
                <button 
                  v-if="isEditing" 
                  @click="salvarEdicaoHorario(horario)" 
                  class="btn-save"
                >Salvar</button>
                <button 
                  v-if="isEditing" 
                  @click="cancelarEdicaoHorario" 
                  class="btn-cancel"
                >Cancelar</button>

                <!-- Botão de Editar aparece quando não está editando o horário atual -->
                <button 
                  v-else 
                  @click="editarHorario(horario)" 
                  class="btn-edit"
                  :disabled="isAdding" 
                >Editar</button>

                <!-- Botão de Excluir só aparece quando não está editando o horário atual -->
                <button 
                  v-if="!isEditing" 
                  @click="excluirHorario(horario._id)" 
                  class="btn-delete"
                >Excluir</button>
              </div>
            </div>
          </div>

          <!-- Exibir a mensagem caso não existam horários para o dia selecionado -->
          <div v-else-if="selectedDay !== '' && horariosFiltrados.length === 0 && !isAdding && !isEditing" class="no-horarios-container">
            <i class="fas fa-exclamation-triangle warning-icon"></i>
            <p class="no-horarios-p">Nenhum horário cadastrado para este dia</p>
          </div>


          <div v-if="!isAdding && selectedDay !== ''">
            <!-- Botão de adicionar novo horário -->
            <button 
              @click="abrirFormularioAdicionar" 
              class="btn btn-add" 
              :disabled="isEditing">
              Adicionar Horário
            </button>
          </div>

          <!-- Formulário de adição de horário -->
          <div v-if="isAdding">
            <hr>
            <h3 v-if="isAdding" class="add-horario-p">Adicionar Novo Horário</h3>
            <div class="horario-edit-container">
              <input type="time" v-model="horarioEditando.hora_inicio" placeholder="Hora Início" class="input-field" />
              <input type="time" v-model="horarioEditando.hora_fim" placeholder="Hora Fim" class="input-field" />
              <button @click="salvarEdicaoHorario" class="btn-save">Salvar</button>
              <button @click="cancelarEdicaoHorario" class="btn-cancel">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
import PaginationComponent from '@/components/shared/Pagination.vue'; 
import api from "@/utils/api"; // Importando o axios configurado

export default {
  name: 'ClassesComponent',
  components: {
    PaginationComponent,
  },
  data() {
    return {
      aulas: [],
      categorias: [],
      instrutores: [],
      searchQuery: "",
      selectedCategoria: "",
      paginaAtual: 1,
      aulasPorPagina: 10,
      totalPaginas: 0,
      totalAulas: 0,
      verModal: false,
      editarModal: false,
      novaAulaModal: false,
      modalHorarios: false,
      aulaSelecionada: {},
      selectedDay: "",
      diasSemana: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
      horariosPorDia: {},
      horariosFiltrados: [],
      horarioEditando: { hora_inicio: '', hora_fim: '' },
      isEditing: false,
      isAdding: false,
    };
  },
  methods: {
    // Função para buscar aulas
    async buscarAulas(resetPage = true) {
      try {
        if (resetPage) {
          this.paginaAtual = 1; // Reseta a página atual para 1 ao fazer uma nova busca
        }

        // Reseta os contadores e resultados antes de realizar a busca
        this.aulas = [];
        this.totalAulas = 0;
        this.totalPaginas = 0;
        
        const queryParam = `?pagina=${this.paginaAtual}&aulasPorPagina=${this.aulasPorPagina}`;
        const searchParam = this.searchQuery ? `&searchQuery=${encodeURIComponent(this.searchQuery)}` : '';
        const categoriaParam = this.selectedCategoria ? `&categoriaId=${this.selectedCategoria}` : '';

        const response = await api.get(`/classes/get-filtered-classes${queryParam}${searchParam}${categoriaParam}`);
        
        // Atualiza os dados após o retorno da API
        this.aulas = response.data.aulas;
        this.totalAulas = response.data.totalAulas;
        this.totalPaginas = Math.ceil(this.totalAulas / this.aulasPorPagina);
      } catch (error) {
        console.error("Erro ao buscar aulas:", error);
      }
    },

    // Resetar filtros
    resetarFiltros() {
      this.searchQuery = "";
      this.selectedCategoria = "";
      this.paginaAtual = 1;
      this.buscarAulas();
    },

    // Ver aula
    verAula(aula) {
      this.aulaSelecionada = aula;
      this.verModal = true;
    },

    // Editar aula
    editarAula(aula) {
      this.aulaEditando = { 
        ...aula,
        categoriaId: aula.categoriaId ? aula.categoriaId._id : "",  // Certifique-se de atribuir o ID correto da categoria
        instrutorId: aula.instrutorId ? aula.instrutorId._id : ""    // Certifique-se de atribuir o ID correto do instrutor
      };
      this.editarModal = true;
    },

    // Salvar edição
    async salvarEdicao() {
      try {
        console.log(this.aulaEditando);
        await api.put(`/admin/update-class/${this.aulaEditando._id}`, this.aulaEditando);
        
        this.editarModal = false;
        this.buscarAulas();
      } catch (error) {
        if (error.response && error.response.data) {
          alert(error.response.data.error || JSON.stringify(error.response.data));
          console.log("Erro ao criar horário:", error.response.data.error || error.response.data);
        } else {
          alert("Erro desconhecido");
          console.log("Erro desconhecido:", error.message);
        }
      }
    },

    // Excluir aula
    async excluirAula(id) {
      if (confirm("Você tem certeza que deseja excluir esta aula?")) {
        try {
          await api.delete(`/admin/delete-class/${id}`);
          this.buscarAulas();
        } catch (error) {
          if (error.response && error.response.data) {
            alert(error.response.data.error || JSON.stringify(error.response.data));
            console.log("Erro ao criar horário:", error.response.data.error || error.response.data);
          } else {
            alert("Erro desconhecido");
            console.log("Erro desconhecido:", error.message);
          }
        }
      }
    },

    // Abrir modal para nova aula
    abrirModalNovaAula() {
      this.novaAulaModal = true;
      this.novaAula = { nome: '', descricao: '', duracao: '', categoriaId: '', instrutorId: '' };
    },

    // Fechar modal de nova aula
    fecharModalNovaAula() {
      this.novaAulaModal = false;
    },

    // Salvar nova aula
    async salvarNovaAula() {
      try {
        console.log('nova aula: ', this.novaAula);
        await api.post("/admin/create-class", this.novaAula);
        this.fecharModalNovaAula();
        this.buscarAulas();
      } catch (error) {
        if (error.response && error.response.data) {
          alert(error.response.data.error || JSON.stringify(error.response.data));
          console.log("Erro ao criar horário:", error.response.data.error || error.response.data);
        } else {
          alert("Erro desconhecido");
          console.log("Erro desconhecido:", error.message);
        }
      }
    }, 

    // Fechar modais
    fecharModal() {
      this.verModal = false;
      this.editarModal = false;
    },

    async abrirModalHorarios(aula) {
      this.aulaSelecionada = aula;
      this.modalHorarios = true;
      
      // Reseta os horários e o estado de seleção antes de carregar novos dados
      this.horariosFiltrados = [];
      this.horariosPorDia = {};
      this.selectedDay = "";
      this.isAdding = false;
      this.isEditing = false;

      // Carrega os horários da aula selecionada
      this.carregarHorarios(aula._id);
    },

    async carregarHorarios(aulaId) {
      try {
        const response = await api.get(`/horarios-disponiveis/aula/${aulaId}`);
        const horarios = response.data;

        // Mapear os horários por dias da semana
        this.horariosPorDia = this.diasSemana.reduce((acc, dia, index) => {
          acc[index] = horarios.filter(horario => horario.diaSemana === index); 
          return acc;
        }, {});

        // Após carregar os horários, verificar se há um dia selecionado
        if (this.selectedDay !== '') {
          this.filtrarHorariosPorDia();
        }
      } catch (error) {
        if (error.response && error.response.data) {
          console.log("Erro ao carregar horários:", error.response.data.error || error.response.data);
        } else {
          alert("Erro desconhecido");
          console.log("Erro desconhecido:", error.message);
        }
      }
    },

    filtrarHorariosPorDia() {
      if (this.selectedDay !== '') {
        this.horariosFiltrados = this.horariosPorDia[this.selectedDay] || [];
      }
    },

    editarHorario(horario) {
      this.isEditing = true;
      this.horarioEditando = { ...horario };
    },

    abrirFormularioAdicionar() {
      this.isAdding = true;
      this.horarioEditando = { hora_inicio: '', hora_fim: '' };
    },

    async salvarEdicaoHorario() {
      try {
        if (this.isEditing) {
          await api.put(`/admin/update-available-time/${this.horarioEditando._id}`, this.horarioEditando);
        } else {
          await api.post(`/admin/create-available-time`, { aulaId: this.aulaSelecionada._id, diaSemana: this.selectedDay, ...this.horarioEditando });
        }

        // Recarregar os horários após adicionar ou editar
        await this.carregarHorarios(this.aulaSelecionada._id);

        // Garantir que os horários filtrados para o dia selecionado sejam atualizados
        this.filtrarHorariosPorDia();

        // Resetar o estado do formulário
        this.isEditing = false;
        this.isAdding = false;

      } catch (error) {
        if (error.response && error.response.data) {
          alert(error.response.data.error || JSON.stringify(error.response.data));
          console.log("Erro ao criar/editar horário:", error.response.data.error || error.response.data);
        } else {
          alert("Erro desconhecido");
          console.log("Erro desconhecido:", error.message);
        }
      }
    },

    cancelarEdicaoHorario() {
      this.isEditing = false;
      this.isAdding = false;
    },

    async excluirHorario(horarioId) {
      try {
        await api.delete(`/admin/delete-available-time/${horarioId}`);
        this.carregarHorarios(this.aulaSelecionada._id); 
      } catch (error) {
        if (error.response && error.response.data) {
          alert(error.response.data.error || JSON.stringify(error.response.data));
          console.log("Erro ao criar horário:", error.response.data.error || error.response.data);
        } else {
          alert("Erro desconhecido");
          console.log("Erro desconhecido:", error.message);
        }
      }
    },

    fecharModalHorarios() {
      this.modalHorarios = false;
      this.horariosFiltrados = [];  // Reseta a lista de horários filtrados
      this.horariosPorDia = {};     // Reseta a lista de horários por dia
      this.selectedDay = "";        // Reseta o dia selecionado
      this.isEditing = false;       // Reseta o estado de edição
      this.isAdding = false;        // Reseta o estado de adição
    },

  },
  mounted() {
    this.buscarAulas();
    api.get("/categories").then((response) => {
      this.categorias = response.data;
    });
    api.get("/usuarios/role/003").then((response) => {
      this.instrutores = response.data;
    });
  },
};
</script>

<style scoped>
.aulas-container {
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 0 auto;
  position: relative;
  background-color: #FFFFFF;
}

.title-container {
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

.nova-aula-btn {
  background-color: #2C3E50;
  color: white;
  padding: 16px 32px;
  border-radius: 25px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nova-aula-btn:hover {
  background-color: #1F2C3C;
}

.filters {
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
  border-radius: 20px;
}

.class-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
  border-radius: 20px;
}

.class-table th,
.class-table td {
  padding: 10px;
  border: 1px solid #e2e8f0;
  text-align: left;
  vertical-align: middle; /* Garante que o conteúdo das células fique centralizado verticalmente */
  font-family: 'Open Sans', sans-serif;

}

.class-table th {
  background-color: #2C3E50;
  color: white;
  padding: 10px;
  text-align: center; /* Centraliza o conteúdo do cabeçalho */
}

.class-table td {
  color: #2F2F2F;
}

.pagination-container {
  font-family: 'Open Sans', sans-serif;
}

.class-table th:first-child{
  border-radius: 20px 0px 0px 0px;
}

.class-table th:last-child{
  border-radius: 0px 20px 0px 0px;
}





.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-items: center; /* Centraliza verticalmente os ícones */
}

.action-icon {
  cursor: pointer;
  font-size: 1.2rem;
  color: #F1C40F; 
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; 
}

.modal-content {
  background: #FFFFFF; /* Cor de fundo do modal */
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  text-align: center; /* Centraliza o texto dentro do modal */
}

.modal-content p {
  margin-bottom: 10px;
  
}

.modal-p{
  text-align: left; 
  font-family:"Open Sans", sans-serif;
  color:#2F2F2F;
}

.modal-p span {
  font-weight: bold;
  margin-right: 2px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  font-family: 'Bebas Neue', sans-serif; /* Fonte para o título */
  color: #2C3E50; /* Cor do texto do título */
  margin: 0;
}

.modal-body {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centraliza o conteúdo verticalmente */
  align-items: center; /* Centraliza o conteúdo horizontalmente */
  color: #2F2F2F; /* Cor do texto */
}

.no-horarios-message {
  font-family: 'Open Sans', sans-serif;
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
}

.no-horarios-p{
  margin-bottom: 20px;
}

.add-horario-p{
  margin: 10px;
  color: #2C3E50;
}

.warning-icon {
  font-size: 3rem;
  color: #f39c12;
  margin-bottom: 10px;
}

.btn-cancel, .btn-delete {
  background-color: #e74c3c; /* Vermelho */
  color: white;
  padding: 16px 32px;
  border-radius: 25px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 5px;
}

.btn-cancel, .btn-delete:hover {
  background-color: #c0392b; /* Vermelho escuro para hover */
}

.btn-save {
  background-color: #2ecc71; /* Verde */
  color: white;
  padding: 16px 32px;
  border-radius: 25px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 5px;
}

.btn-save:hover {
  background-color: #27ae60; /* Verde escuro para hover */
}

.btn-edit {
  background-color: #f1c40f; /* Amarelo */
  color: #2C3E50; /* Cor do texto */
  padding: 16px 32px;
  border-radius: 25px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-edit:hover {
  background-color: #d4ac0d; /* Amarelo escuro para hover */
}

.btn-add{
  margin-top: 10px;
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


