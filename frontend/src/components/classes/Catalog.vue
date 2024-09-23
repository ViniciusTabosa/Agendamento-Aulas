<template>
  <section class="catalog">
    <!-- Título do Catálogo -->
    <div class="title-container">
      <h1 class="title">Catálogo de Aulas</h1>
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
      <button @click="resetarFiltros" class="btn">Resetar Filtros</button>
    </div>

    <!-- Lista de Aulas -->
    <div class="aulas-container">
      <CardAula 
        v-for="aula in aulas" 
        :key="aula.id" 
        :aula="aula" 
      />
    </div>

    <!-- Paginação -->
    <PaginationComponent 
      :paginaAtual="paginaAtual" 
      :totalPaginas="totalPaginas" 
      :totalRegistros="totalAulas"
      :registrosPorPagina="aulasPorPagina"
      @pagina-trocada="paginaAtual = $event; buscarAulas(false)"
    />
  </section>
</template>

<script>
import CardAula from '@/components/shared/CardAula.vue';
import PaginationComponent from '@/components/shared/Pagination.vue';
import api from "@/utils/api"; 
export default {
  name: 'CatalogComponent',
  components: { CardAula, PaginationComponent },
  data() {
    return { 
      aulas: [],
      categorias: [],
      selectedCategoria: "",
      searchQuery: "",
      paginaAtual: 1,
      totalPaginas: 0,
      totalAulas: 0,
      aulasPorPagina: 6,
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

    // Função para resetar os filtros
    resetarFiltros() {
      this.searchQuery = "";
      this.selectedCategoria = "";
      this.buscarAulas(true); // Reseta a página ao resetar os filtros
    },
  },
  mounted() {
    this.buscarAulas();
    api.get("/categories").then((response) => {
      this.categorias = response.data;
    });
  },
};
</script>

<style scoped>
/* Estilo do catálogo e cards */
.catalog {
  text-align: center;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
}

.title-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  max-width: 1000px;
  margin: 0 auto;
}

.title {
  color: #6e56cf;
  font-size: 2rem;
  text-align: center;
  margin: 0 auto;
}

.filters {
  margin-bottom: 20px;
  max-width: 1000px;
}

.search-input,
.filter-select {
  width: 37%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  font-size: 16px;
  margin-right: 10px;
}

.btn {
  background-color: #6e56cf;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #5b3da3;
}

.aulas-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  max-width: 1000px; 
  margin-bottom: 20px;
}

.card-aula {
  width: 30%;
  box-sizing: border-box;
}
</style>
