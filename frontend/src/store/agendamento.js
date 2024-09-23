import { defineStore } from 'pinia';

export const useAgendamentoStore = defineStore('agendamento', {
  state: () => ({
    aulaId: null,
    diaSelecionado: null,
    horarioSelecionado: null,
  }),
  actions: {
    setAgendamentoTemp(aulaId, diaSelecionado, horarioSelecionado) {
      this.aulaId = aulaId;
      this.diaSelecionado = diaSelecionado;
      this.horarioSelecionado = horarioSelecionado;
    },
    clearAgendamentoTemp() {
      this.aulaId = null;
      this.diaSelecionado = null;
      this.horarioSelecionado = null;
    },
  },
});
