<template>
  <div class="detalhes-agendamento">
    <h1>Detalhes do Agendamento</h1>

    <div v-if="agendamento">
      <p><strong>Aula:</strong> {{ agendamento.aulaId.nome }}</p>
      <p><strong>Data e Horário:</strong> {{ formatarData(agendamento.horarioId.diaSemana) }} - {{ agendamento.horarioId.hora_inicio }} às {{ agendamento.horarioId.hora_fim }}</p>
      <p><strong>Status:</strong> {{ agendamento.statusId.nome }}</p>

      <!-- Exibir botões apenas se o status não for 'Cancelada' -->
      <div v-if="agendamento.statusId.code !== '003'" class="botoes-acoes">
        <button @click="confirmarCancelamento" class="cancelar-btn">Cancelar</button>
        <button @click="toggleReagendamento" class="reagendar-btn">Reagendar</button>
      </div>
    </div>

    <div v-if="exibirReagendamento" class="reagendamento">
      <h2>Reagendar</h2>
      <div v-if="horariosDisponiveis.length > 0">
        <ul class="horarios-lista">
          <li v-for="horario in horariosDisponiveis" :key="horario._id" class="horario-item">
            {{ formatarData(horario.diaSemana) }} - {{ horario.hora_inicio }} às {{ horario.hora_fim }}
            <button @click="confirmarReagendamento(horario._id)" class="confirmar-reagendar-btn">Confirmar</button>
          </li>
        </ul>
      </div>
      <p v-else>Não há horários disponíveis no momento.</p>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/api';

export default {
  name: 'ScheduleDetailsComponent',
  data() {
    return {
      agendamento: null,
      horariosDisponiveis: [],
      exibirReagendamento: false,
    };
  },
  async created() {
    const agendamentoId = this.$route.params.id; // Obtenha o ID do agendamento a partir da rota

    try {
      // Obter os detalhes do agendamento
      const response = await axios.get(`/agendamentos/${agendamentoId}`);
      this.agendamento = response.data;

      // Obter os horários disponíveis para reagendamento
      const responseHorarios = await axios.get(`/horarios-disponiveis/aula/${this.agendamento.aulaId._id}`);
      this.horariosDisponiveis = responseHorarios.data.filter(horario => horario.disponivel);
    } catch (error) {
      console.error('Erro ao carregar o agendamento:', error);
    }
  },
  methods: {
    formatarData(diaSemana) {
      const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      return diasSemana[diaSemana];
    },
    toggleReagendamento() {
      this.exibirReagendamento = !this.exibirReagendamento;
    },
    async confirmarReagendamento(novoHorarioId) {
      try {
        const confirmacao = confirm('Você deseja confirmar o reagendamento?');
        if (confirmacao) {
          await axios.put('/agendamentos/reagendar', {
            agendamentoId: this.agendamento._id,
            novoHorarioId,
          });
          alert('Agendamento reagendado com sucesso!');
          this.$router.push('/my-scheduled-classes');
        }
      } catch (error) {
        console.error('Erro ao reagendar:', error);
        alert('Erro ao reagendar o agendamento.');
      }
    },
    async confirmarCancelamento() {
      try {
        const confirmacao = confirm('Você deseja realmente cancelar este agendamento?');
        if (confirmacao) {
          await axios.delete('/agendamentos/cancelar', {
            data: {
              agendamentoId: this.agendamento._id,
              confirmacaoCancelamento: true,
            },
          });
          alert('Agendamento cancelado com sucesso!');
          this.$router.push('/meus-agendamentos');
        }
      } catch (error) {
        console.error('Erro ao cancelar o agendamento:', error);
        alert('Erro ao cancelar o agendamento.');
      }
    },
  },
};
</script>

<style scoped>
.detalhes-agendamento {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px #2c3e5062;
  font-family: 'Open Sans', sans-serif;
}

h1 {
  text-align: center;
  color: #2C3E50;
  font-family: "Bebas Neue", sans-serif;
  
}

.botoes-acoes {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.cancelar-btn, .reagendar-btn, .confirmar-reagendar-btn {
  color: #D6EAF8;
  background-color: #2C3E50;
  padding: 10px 20px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;
  text-transform: uppercase;
}

.cancelar-btn{
  background-color: #D6EAF8;
  color: #000;
}

.cancelar-btn:hover {
  background-color: #e47d7d;
}

.reagendar-btn:hover, .confirmar-reagendar-btn:hover {
  background: linear-gradient(#2C3E50, #648db6);
}

.reagendamento {
  margin-top: 20px;
}

.reagendamento h2{
  color: #2C3E50;
}

.horarios-lista {
  list-style: none;
  padding: 0;
}

.horario-item {
  margin: 10px 0;
  padding: 15px;
  background-color: #D6EAF8;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.horario-item:hover{
  transform: scale(1.02);
}

.confirmar-reagendar-btn{
  margin-left: 10px;
}
</style>
