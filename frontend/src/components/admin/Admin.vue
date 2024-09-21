<template>
  <div class="dashboard">
    <h1>Dashboard Administrativo</h1>

    <div class="dashboard-stats">
      <div class="stat-box">
        <h2>Total de Aulas</h2>
        <p>{{ totalAulas }}</p>
      </div>

      <div class="stat-box">
        <h2>Aulas Disponíveis</h2>
        <p>{{ totalAulasDisponiveis }}</p>
      </div>

      <div class="stat-box">
        <h2>Total de Agendamentos</h2>
        <p>{{ totalAgendamentos }}</p>
      </div>

      <div class="stat-box">
        <h2>Total de Usuários</h2>
        <p>{{ totalUsuarios }}</p>
      </div>

      <div class="stat-box">
        <h2>Horários Ocupados</h2>
        <p>{{ horariosOcupados }} / {{ totalHorarios }}</p>
      </div>
    </div>

    <h2>Aulas mais Populares</h2>
    <ul>
      <li v-for="aula in aulasPopulares" :key="aula._id">
        {{ aula.aula[0].nome }} - {{ aula.totalAgendamentos }} agendamentos
      </li>
    </ul>

    <h2>Próximas Aulas</h2>
    <ul>
      <li v-for="aula in proximasAulas" :key="aula._id">
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
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>
