<template>
  <section class="home">
    <h1>Aulas em Destaque</h1> <!-- Título adequado -->
    <div class="aulas-container">
      <CardAula 
        v-for="aula in aulas" 
        :key="aula.id" 
        :aula="aula" 
      />
    </div>
  </section>
</template>

<script>
import CardAula from '@/components/shared/CardAula.vue';
import axios from '@/utils/api';

export default {
  components: { CardAula },
  data() {
    return { 
      aulas: [],
    };
  },
  async mounted() {
    try {
      const response = await axios.get('/classes/get-most-popular-classes');
      this.aulas = response.data;
    } catch (error) {
      console.error('Erro ao carregar aulas:', error);
    }
  },
};
</script>

<style scoped>
.home {
  text-align: center;
}

.aulas-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
</style>
