<template>
  <div class="dashboard">
    <h1 class="text-3xl font-bold text-violet-700 mb-8">Dashboard Administrativo</h1>

    <div class="dashboard-stats">
      <div class="stat-box bg-violet-100 text-violet-900">
        <h2>Total de Aulas</h2>
        <p class="text-3xl font-bold text-violet-700">{{ totalAulas }}</p>
      </div>

      <div class="stat-box bg-violet-100 text-violet-900">
        <h2>Aulas Disponíveis</h2>
        <p class="text-3xl font-bold text-violet-700">{{ totalAulasDisponiveis }}</p>
      </div>

      <div class="stat-box bg-violet-100 text-violet-900">
        <h2>Total de Agendamentos</h2>
        <p class="text-3xl font-bold text-violet-700">{{ totalAgendamentos }}</p>
      </div>

      <div class="stat-box bg-violet-100 text-violet-900">
        <h2>Total de Usuários</h2>
        <p class="text-3xl font-bold text-violet-700">{{ totalUsuarios }}</p>
      </div>

      <div class="stat-box bg-violet-100 text-violet-900">
        <h2>Horários Ocupados</h2>
        <p class="text-3xl font-bold text-violet-700">{{ horariosOcupados }} / {{ totalHorarios }}</p>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-violet-600 mt-8 mb-4">Aulas mais Populares</h2>
    <ul>
      <li v-for="aula in aulasPopulares" :key="aula._id" class="bg-violet-50 text-violet-900 border-violet-200 p-4 rounded-lg shadow-md">
        {{ aula.aula[0].nome }} - {{ aula.totalAgendamentos }} agendamentos
      </li>
    </ul>

    <h2 class="text-2xl font-bold text-violet-600 mt-8 mb-4">Próximas Aulas</h2>
    <ul>
      <li v-for="aula in proximasAulas" :key="aula._id" class="bg-violet-50 text-violet-900 border-violet-200 p-4 rounded-lg shadow-md">
        Aula: {{ aula.aulaId.nome }} - Aluno: {{ aula.usuarioId.nome }} {{ aula.usuarioId.sobrenome }} - Horário: {{ aula.horarioId.hora_inicio }}
      </li>
    </ul>
  </div>
</template>

<script>
import api from '@/utils/api';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      totalAulas: 0,
      totalAulasDisponiveis: 0,
      totalAgendamentos: 0,
      totalUsuarios: 0,
      totalHorarios: 0,
      horariosOcupados: 0,
      aulasPopulares: [],
      proximasAulas: [],
    };
  },
  async created() {
    try {
      const response = await api.get('/dashboard');
      const {
        totalAulas,
        totalAulasDisponiveis,
        totalAgendamentos,
        totalUsuarios,
        totalHorarios,
        horariosOcupados,
        aulasPopulares,
        proximasAulas,
      } = response.data;

      this.totalAulas = totalAulas;
      this.totalAulasDisponiveis = totalAulasDisponiveis;
      this.totalAgendamentos = totalAgendamentos;
      this.totalUsuarios = totalUsuarios;
      this.totalHorarios = totalHorarios;
      this.horariosOcupados = horariosOcupados;
      this.aulasPopulares = aulasPopulares;
      this.proximasAulas = proximasAulas;
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.stat-box {
  flex: 1;
  min-width: 200px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1, h2 {
  color: #6b46c1;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  padding: 10px;
  background-color: #faf5ff;
  border: 1px solid #e9d8fd;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>
