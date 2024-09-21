<template>
  <div class="card-aula">
    <h3>{{ aula.nome }}</h3>
    <p class="descricao">{{ aula.descricao }}</p>
    <p><strong>Instrutor(a):</strong> {{ aula.instrutorId.nome }} {{ aula.instrutorId.sobrenome }}</p>
    <div v-if="aula.temHorarioDisponivel">
      <button @click="verDetalhesAula" class="agendar-btn">Agendar Aula</button>
    </div>
    <p v-else class="indisponivel">Indisponível</p>
  </div>
</template>

<script>
export default {
  props: ['aula'],
  methods: {
    verDetalhesAula() {
      // Redireciona para a página de detalhes da aula
      this.$router.push(`/class-details/${this.aula._id}`);
    }
  }
};
</script>

<style scoped>
.card-aula {
  background-color: #f5f2ff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 250px; /* Largura fixa */
  height: 250px; /* Altura fixa */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;
}

.card-aula:hover {
  transform: translateY(-5px);
}

h3 {
  color: #644fc1;
  margin-bottom: 10px;
}

.descricao {
  color: #333;
  margin-bottom: 10px;
  /* Limitar o texto e adicionar reticências */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* Não quebrar linha */
}

.agendar-btn {
  background-color: #6e56cf;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.agendar-btn:hover {
  background-color: #644fc1;
}

.indisponivel {
  color: red;
  font-weight: bold;
}

.card-aula p {
  margin: 5px 0;
}
</style>
