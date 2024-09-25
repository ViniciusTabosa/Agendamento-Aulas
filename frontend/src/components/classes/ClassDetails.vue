<template>
  <div class="detalhes-aula">
    <div class="detalhes-container">
      <div class="titulo-fundo">
        <h1 class="titulo">{{ aula?.nome || 'Aula não disponível' }}</h1>
      </div>
      <p class="descricao">{{ aula?.descricao || 'Descrição não disponível' }}</p>
      <h3 v-if="aula?.instrutorId" class="instrutor">
        Instrutor: {{ aula.instrutorId?.nome || 'Nome não disponível' }} {{ aula.instrutorId?.sobrenome || '' }}
      </h3>

      <h4 class="horarios-titulo">Horários Disponíveis:</h4>
      <div v-if="horariosDisponiveis.length > 0">
        <ul class="horarios-lista">
          <li v-for="horario in horariosDisponiveis" :key="horario._id" class="horario-item">
            {{ formatarDiaSemana(horario.diaSemana) }} - 
            {{ horario.hora_inicio || 'Hora não disponível' }} às {{ horario.hora_fim || 'Hora não disponível' }}
            <button 
              v-if="horario.disponivel" 
              @click="tentarConfirmarAgendamento(horario._id)" 
              class="agendar-btn"
            >
              Agendar
            </button>
            <span v-else class="indisponivel-texto">Indisponível</span>
          </li>
        </ul>
      </div>
      <p v-else class="sem-horarios">Esta aula não tem horários disponíveis no momento.</p>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/api'; // Usando Axios
import { useAgendamentoStore } from '@/store/agendamento';
import { useAuthStore } from '@/store/auth';

export default {
  name: 'ClassDetailsComponent',
  data() {
    return {
      aula: {},
      horariosDisponiveis: [],
      horarioSelecionado: null,
    };
  },
  async created() {
    const aulaId = this.$route.params.id;

    try {
      // Requisição para obter os detalhes da aula
      const responseAula = await axios.get(`/classes/${aulaId}`);
      this.aula = responseAula.data;

      // Requisição para obter os horários disponíveis
      const responseHorarios = await axios.get(`/horarios-disponiveis/aula/${aulaId}`);
      this.horariosDisponiveis = responseHorarios.data;

    } catch (error) {
      console.error("Erro ao carregar os detalhes da aula:", error);
    }
  },

  methods: {
    formatarDiaSemana(dia) {
      const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      return diasSemana[dia];
    },

    tentarConfirmarAgendamento(horarioId) {
      this.horarioSelecionado = horarioId;
      const agendamentoStore = useAgendamentoStore();

      // Armazena temporariamente o horário e a aula selecionados
      agendamentoStore.setAgendamentoTemp(this.aula._id, null, horarioId);

      if (this.isLoggedIn()) {
        // Se o usuário estiver logado, confirmar o agendamento
        this.confirmarAgendamento();
      } else {
        alert('É necessário fazer login para fazer um agendamento');
        // Redirecionar para login com a rota de retorno e dados do agendamento
        this.$router.push({ 
          path: '/login', 
          query: { 
            redirectTo: `/class-details/${this.aula._id}`,
            horarioId: horarioId 
          } 
        });
      }
    },

    isLoggedIn() {
      return !!sessionStorage.getItem('token');
    },

    async confirmarAgendamento() {
      const agendamentoStore = useAgendamentoStore();
      const authStore = useAuthStore();

      // Obter userId do sessionStorage ou do authStore
      const usuarioId = sessionStorage.getItem('usuarioId') || authStore.user?.userId;

      // Verifique se os campos obrigatórios estão disponíveis
      if (!usuarioId || !agendamentoStore.aulaId || !agendamentoStore.horarioSelecionado) {
        alert('Informações de agendamento incompletas.');
        return;
      }

      // Enviar requisição de confirmação de agendamento para a API
      try {
        await axios.post('/agendamentos', {
          usuarioId,
          aulaId: agendamentoStore.aulaId,
          horarioId: agendamentoStore.horarioSelecionado,
        });
        alert('Agendamento confirmado!');
        agendamentoStore.clearAgendamentoTemp();
        // Atualizar os horários disponíveis após o agendamento
        this.atualizarHorarios();
      } catch (error) {
        console.error('Erro ao confirmar agendamento:', error);
      }
    },

    async atualizarHorarios() {
      const aulaId = this.$route.params.id;
      const responseHorarios = await axios.get(`/horarios-disponiveis/aula/${aulaId}`);
      this.horariosDisponiveis = responseHorarios.data;
    },
  }
};
</script>

<style scoped>
.detalhes-aula {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F5F1E9;
  min-height: 80vh;
}

.detalhes-container {
  background-color: #F5F1E9;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  width: 800px;
  text-align: center;
  box-shadow: 0 4px 8px #2c3e5062;
  position: absolute;
}

.detalhes-container h1{
  font-family: "Bebas Neue", sans-serif;
  color: #F5F1E9;
}

.titulo-fundo{
  background-color: #2C3E50;
  border-radius: 20px 20px 0px 0px;
  width: 100%;
}

.titulo {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.descricao {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.instrutor {
  font-size: 1.3rem;
  margin-bottom: 30px;
}

.titulo, .descricao, .instrutor{
  font-family: "Open Sans", sans-serif;
  color: #000;
}

.horarios-titulo {
  font-family: "Open Sans", sans-serif;
  font-size: 1.5rem;
  color: #2C3E50;
  margin-bottom: 15px;
}

.horarios-lista {
  list-style: none;
  padding: 0 30px 30px 30px;
}

.horario-item {
  font-family: "Open Sans", sans-serif;
  font-weight: bold;
  background-color: #D6EAF8;
  margin: 10px 0;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.horario-item:hover{
  transform: scale(1.02);
}

.agendar-btn {
  background-color: #2C3E50;
  color: #D6EAF8;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  text-transform: uppercase;
}

.agendar-btn:hover {
  color: #fff;
  background: linear-gradient(#2C3E50, #648db6);
}

.sem-horarios {
  color: #d32f2f;
  font-size: 1.2rem;
  margin-top: 20px;
}
</style>
