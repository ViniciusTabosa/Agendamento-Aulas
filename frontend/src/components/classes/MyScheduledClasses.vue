<template>
  <div class="meus-agendamentos">
    <h1>Minha Agenda</h1>
    <div v-if="calendarOptions">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from '@/utils/api';

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        locale: 'pt-br',
        events: [],
        slotMinTime: '00:00',
        slotMaxTime: '24:00',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth',
        },
        titleFormat: {
          year: 'numeric',
          month: 'long',
        },
        dayHeaderFormat: {
          weekday: 'short',
          day: 'numeric',
        },
        dayHeaderContent: (args) => {
          const dayName = args.text.slice(0, 3);
          const dayNumber = args.text.slice(5);
          return {
            html: `<span style="display: block; text-transform: uppercase; margin-bottom: 5px;">${dayName}</span><span>${dayNumber}</span>`
          };
        },
        buttonText: {
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
        },
        allDaySlot: false,
        slotLabelFormat: { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false, 
          hourCycle: 'h23' 
        },
        eventClick: this.handleEventClick,
      },
      agendamentos: [],
    };
  },
  async created() {
    const usuarioId = sessionStorage.getItem('usuarioId');

    if (!usuarioId || usuarioId === 'null' || usuarioId === 'undefined') {
      alert('Você precisa estar logado para acessar seus agendamentos.');
      this.$router.push('/login');
      return;
    }

    try {
      const response = await axios.get(`/agendamentos/usuario-agendamentos/${usuarioId}`);
      const agendamentos = response.data;

      // Filtrar agendamentos não cancelados
      this.agendamentos = agendamentos
        .filter(agendamento => agendamento.statusId.code !== '003')
        .map(agendamento => {
          const { horarioId, aulaId } = agendamento;
          const eventDate = this.getEventDateFromWeekDay(horarioId.diaSemana, horarioId.hora_inicio, horarioId.hora_fim);

          return {
            title: aulaId.nome,
            start: eventDate.start,
            end: eventDate.end,
            id: agendamento._id,
            color: '#7e57c2',
          };
        });

      this.setupCalendar();
    } catch (error) {
      console.error('Erro ao carregar os agendamentos:', error);
    }
  },
  methods: {
    setupCalendar() {
      // Mesmo que agendamentos esteja vazio, o calendário será renderizado
      this.calendarOptions.events = this.agendamentos.length ? this.agendamentos : [];
    },
    handleEventClick(info) {
      const agendamentoId = info.event.id;
      this.$router.push(`/schedule-details/${agendamentoId}`);
    },
    getEventDateFromWeekDay(diaSemana, horaInicio, horaFim) {
      const today = new Date();
      const todayDayOfWeek = today.getDay();
      let daysToTargetDay = diaSemana - todayDayOfWeek;

      if (daysToTargetDay < 0) {
        daysToTargetDay += 7;
      }

      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + daysToTargetDay);

      const startDate = this.setTimeToEvent(eventDate, horaInicio);
      const endDate = this.setTimeToEvent(eventDate, horaFim);

      return { start: startDate, end: endDate };
    },
    setTimeToEvent(eventDate, timeString) {
      const [hours, minutes] = timeString.split(':');
      const dateWithTime = new Date(eventDate);
      dateWithTime.setHours(hours, minutes, 0, 0);
      return dateWithTime;
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

.meus-agendamentos {
  max-width: 900px;
  margin: 40px auto;
}

h1 {
  text-align: center;
  color: #2C3E50;
  margin-bottom: 20px;
  font-family: "Bebas Neue", sans-serif;
  font-weight: 100;
}

.fc-toolbar-title {
  color: #5e35b1;
  font-size: 1.5rem;
}

.fc-button-primary {
  background-color: #7e57c2;
  border-color: #7e57c2;
}

.fc-button-primary:hover {
  background-color: #6a1b9a;
  border-color: #6a1b9a;
}

.fc-daygrid-event {
  background-color: #7e57c2;
  color: white;
  border: none;
}
</style>
