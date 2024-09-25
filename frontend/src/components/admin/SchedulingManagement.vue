<template>
  <div class="agendamentos-container">

    <!-- Título -->
    <div class="title-container">
      <h1 class="title">Gerenciamento de Agendamentos</h1>
    </div>

    <!-- Input de Busca e Filtro -->
    <div class="filters">
      <input
        type="text"
        v-model="searchQuery"
        @input="buscarAgendamentos"
        placeholder="Busque pelo nome do usuário ou da aula"
        class="search-input"
      />
      <button @click="resetarFiltros" class="btn-reset">Resetar Filtros</button>
    </div>

    <!-- Tabela de Agendamentos -->
    <div class="table-wrapper">
      <table class="category-table">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Aula</th>
            <th>Horário</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="agendamento in agendamentos" :key="agendamento._id">
            <td>{{ agendamento.usuarioId?.nome }} {{ agendamento.usuarioId?.sobrenome }}</td>
            <td>{{ agendamento.aulaId?.nome }}</td>
            <td>{{ agendamento.horarioId?.hora_inicio }} às {{ agendamento.horarioId?.hora_fim }} </td>
            <td>{{ agendamento.statusId?.nome }}</td>
            <td class="actions">
              <span @click="verAgendamento(agendamento)" class="action-icon">
                <i class="fas fa-eye"></i>
              </span>
              <span @click="editarAgendamento(agendamento)" class="action-icon">
                <i class="fas fa-edit"></i>
              </span>
              <span @click="cancelarAgendamento(agendamento._id)" class="action-icon">
                <i class="fas fa-trash-alt"></i>
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Componente de Paginação -->
      <PaginationComponent
        :paginaAtual="paginaAtual"
        :totalPaginas="totalPaginas"
        :totalRegistros="totalAgendamentos"
        :registrosPorPagina="agendamentosPorPagina"
        @pagina-trocada="paginaAtual = $event; buscarAgendamentos(false)"
      />
    </div>

    <!-- Modal para visualizar agendamento -->
    <div v-if="verModal" class="modal">
      <div class="modal-content">
        <h2>Detalhes do Agendamento</h2>
        <p><strong>Usuário:</strong> {{ agendamentoSelecionado.usuarioId?.nome }} {{ agendamentoSelecionado.usuarioId?.sobrenome }}</p>
        <p><strong>Aula:</strong> {{ agendamentoSelecionado.aulaId?.nome }}</p>
        <p><strong>Horário:</strong> {{ agendamentoSelecionado.horarioId?.hora_inicio }} às {{ agendamentoSelecionado.horarioId?.hora_fim }}</p>
        <p><strong>Status:</strong> {{ agendamentoSelecionado.statusId?.nome }}</p>
        <button @click="fecharModal" class="btn">Fechar</button>
      </div>
    </div>

    <!-- Modal para editar agendamento -->
    <div v-if="editarModal" class="modal">
      <div class="modal-content">
        <h2>Editar Agendamento</h2>
        <select v-model="selectedHorario" class="input-field">
          <option value="">-- Horários Disponíveis -- </option>
          <option v-for="horario in horariosDisponiveis" :key="horario._id" :value="horario._id">
            {{ horario.hora_inicio }} às {{ horario.hora_fim }}
          </option>
        </select>
        <button @click="salvarEdicao" class="btn-save" style="margin-right: 10px;">Salvar</button>
        <button @click="fecharModal" class="btn-cancel">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import PaginationComponent from '@/components/shared/Pagination.vue';
import api from "@/utils/api"; 

export default {
  name: 'SchedulingManagementComponent',
  components: {
    PaginationComponent
  },
  data() {
    return {
      agendamentos: [],
      searchQuery: "",
      paginaAtual: 1,
      totalPaginas: 0,
      totalAgendamentos: 0,
      agendamentosPorPagina: 10,
      verModal: false,
      editarModal: false,
      agendamentoSelecionado: {},
      agendamentoEditando: { horarioId: '' },
      horariosDisponiveis: [], // Armazena horários disponíveis para reagendar
      selectedHorario: '' // Armazena o horário selecionado
    };
  },
  methods: {
    // Função para buscar agendamentos
    async buscarAgendamentos(resetPage = true) {
      try {
        if (resetPage) this.paginaAtual = 1;

        const queryParam = `?pagina=${this.paginaAtual}&agendamentosPorPagina=${this.agendamentosPorPagina}`;
        const searchParam = this.searchQuery ? `&searchQuery=${encodeURIComponent(this.searchQuery)}` : '';
  
        const response = await api.get(`/agendamentos/get-filtered-scheduling${queryParam}${searchParam}`);
        
        this.agendamentos = response.data.agendamentos;
        this.totalAgendamentos = response.data.totalAgendamentos;
        this.totalPaginas = Math.ceil(this.totalAgendamentos / this.agendamentosPorPagina);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      }
    },

    // Resetar filtros
    resetarFiltros() {
      this.searchQuery = "";
      this.paginaAtual = 1;
      this.buscarAgendamentos();
    },

    // Ver agendamento
    verAgendamento(agendamento) {
      this.agendamentoSelecionado = agendamento;
      this.verModal = true;
    },

    // Editar agendamento
    async editarAgendamento(agendamento) {
      this.agendamentoEditando = { ...agendamento };
      this.selectedHorario = ''; // Reseta o horário selecionado ao abrir o modal
      this.editarModal = true;

      // Buscar horários disponíveis para reagendamento
      try {
        const response = await api.get(`/horarios-disponiveis/aula/${agendamento.aulaId._id}`);
        // Filtrar apenas os horários disponíveis
        this.horariosDisponiveis = response.data.filter(horario => horario.disponivel);
      } catch (error) {
        console.error("Erro ao buscar horários disponíveis:", error);
      }
    },

    // Salvar edição (reagendar)
    async salvarEdicao() {
      try {
        if (this.selectedHorario) {
          await api.put(`/agendamentos/reagendar`, {
            agendamentoId: this.agendamentoEditando._id,
            novoHorarioId: this.selectedHorario
          });
          this.editarModal = false;
          this.buscarAgendamentos();
        } else {
          alert("Por favor, selecione um horário válido.");
        }
      } catch (error) {
        console.error("Erro ao salvar edição:", error);
      }
    },

    // Cancelar Agendamento
    async cancelarAgendamento(id) {
      if (confirm("Você tem certeza que deseja cancelar este agendamento?")) {
        try {
          await api.put(`/agendamentos/cancelar`, { agendamentoId: id });
          this.buscarAgendamentos();
        } catch (error) {
          console.error("Erro ao cancelar agendamento:", error);
        }
      }
    },

    // Fechar modais
    fecharModal() {
      this.verModal = false;
      this.editarModal = false;
    },
  },
  mounted() {
    this.buscarAgendamentos();
  },
};
</script>

<style scoped>
.agendamentos-container {
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 0 auto;
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

.filters {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  font-family: 'Open Sans', sans-serif;
  width: 30%;
  padding: 12px 16px;
  border: 2px solid #D6EAF8;
  border-radius: 25px;
  font-size: 16px;
  color: #2F2F2F;
  margin-right: 10px;
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

.category-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
}

.category-table th,
.category-table td {
  padding: 10px;
  border: 1px solid #e2e8f0;
  text-align: left;
  vertical-align: middle;
}

.category-table th {
  background-color: #2C3E50;
  color: white;
  padding: 10px;
  text-align: center;
}

.category-table td {
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
  background: #FFFFFF; 
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  text-align: center; 
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  font-family: 'Bebas Neue', sans-serif; 
  color: #2C3E50; 
  margin: 0;
}

.modal-body {
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
  color: #2F2F2F; 
}

.btn-save, .btn-cancel, .btn-edit {
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-save {
  background-color: #2ecc71; /* Verde */
  color: white;
}

.btn-save:hover {
  background-color: #27ae60; 
}

.btn-cancel {
  background-color: #e74c3c; /* Vermelho */
  color: white;
}

.btn-cancel:hover {
  background-color: #c0392b; 
}

.btn-edit {
  background-color: #f1c40f; /* Amarelo */
  color: #2C3E50; 
}

.btn-edit:hover {
  background-color: #d4ac0d; 
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
