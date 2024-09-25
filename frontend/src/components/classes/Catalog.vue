<template>
  <section class="aulas-bg">
    <h1>Catálogo de Aulas</h1>

    <!-- Input de Busca e Filtro por Categoria -->
    <div class="filters">
      <input
        type="text"
        v-model="searchQuery"
        @input="buscarAulasDebounced"
        placeholder="Digite o nome da aula"
        class="search-input"
      />
      <select v-model="selectedCategoria" @change="buscarAulas" class="filter-select">
        <option value="">Todas as Categorias</option>
        <option v-for="categoria in categorias" :key="categoria._id" :value="categoria._id">
          {{ categoria.nome }}
        </option>
      </select>
      <button @click="resetarFiltros" class="btn-search-reset btn">Resetar Filtros</button>
    </div>

    <!-- Lista de Aulas -->
    <div class="aulas">
      <div v-for="aula in aulas" :key="aula._id" class="aula carrossel">
        <div class="aula-content">
          <div class="containerh2">
            <h2>{{ aula.nome }}</h2>
          </div>
          <h3><span class="descricao-aula">{{ aula.descricao }}</span></h3>
          
          <div class="desc">
            <div class="desc-content">
              <img src="@/assets/images/user.png" alt="Icone de um calendário">
              <div class="desc-content-value">
                <h4>Instrutor(a): </h4>
                <span> {{ aula.instrutorId.nome}} {{ aula.instrutorId.sobrenome }} </span>
              </div>
            </div>
            <div class="desc-content">
              <img src="@/assets/images/clock.png" alt="Ícone de um relógio">
              <div class="desc-content-value">
                <h4>Duração: </h4>
                  <span>{{ aula.duracao }} {{ aula.duracao === 1 ? 'hora' : 'horas' }}</span>
              </div>
            </div>
            <div class="desc-content">
              <img src="@/assets/images/category.png" alt="Ícone de um relógio">
              <div class="desc-content-value">
                <h4>Categoria: </h4>
                  <span>{{ aula.categoriaId.nome }}</span>
              </div>
            </div>
          </div>
          <router-link :to="`/class-details/${aula._id}`" class="btn-aula btn-carrossel">Agendar</router-link>
        </div>
      </div>
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

import PaginationComponent from '@/components/shared/Pagination.vue';
import api from "@/utils/api"; 
import { debounce } from 'lodash';

export default {
  name: 'CatalogComponent',
  components: { PaginationComponent },
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
      buscarAulasDebounced: debounce(this.buscarAulas, 300),
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
.filters {
  margin-bottom: 50px;
  max-width: 1000px;
}

.search-input,
.filter-select {
  width: 37%;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  font-size: 16px;
  margin-right: 10px;
}

.aulas-bg{
   margin-top: 80px;
   width: 100%;
   display: grid;
   justify-content: center;
   align-items: center;
   margin-bottom: 100px;
}

.aulas-bg h1{

   text-align: center;
   font-family: "Bebas Neue", sans-serif;
   font-size: 4rem;
   color: #2C3E50;
   margin-bottom: 80px;
   font-weight: 400;
}

.subTitulo{
  display: block;
}

.aulas {
   width: 1000px;
   display: flex;
   flex-flow: row wrap;
   gap: 40px;
}

.aula {
   width: 300px;
   height: 420px;
   border: 1px solid #2C3E50;
   border-radius: 20px;
   position: relative;
   overflow: hidden;
   box-shadow: 5px 5px 10px rgba(71, 85, 110, 0.9);
}

.aula:hover{
   transform: scale(1.05);
   cursor: pointer;
} 

.containerh2{
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
   height: 60px;
   background-color: #2C3E50;
   margin-bottom: 20px;
}

.containerh2 h2{
   color: #F5F1E9;

   font-size: 1.4rem;
}

.containerh2 + h3{
   text-align: center;
   margin-bottom: 20px;
}

h3, li, h4, h2{
   font-family: "Open Sans", sans-serif;
}

.descricao-aula {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  min-height: 96px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
  line-height: 1.5rem; 
  text-align: justify;
  padding: 0 15px;
}

h4, .containerh2 + h3 {
   color: #2f2f2f;
   font-size: 1rem;
   
}

.desc{
   padding: 0 15px;
   margin-top: 20px;
}

.desc-content{
   display: grid;
   grid-template-columns: 16px 1fr;
   gap: 0 10px;
}

.desc-content h4 {
   display: inline;
}

.desc-content img{
 margin-top: 3px;
}

.desc-content-value{
   margin-bottom: 10px;
   font-family: "Open Sans", sans-serif;
}

.btn-search-reset{
  background-color: #2C3E50;
  color: #D6EAF8;
  font-family: "Open Sans";
  font-size: 0.9rem;
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-transform: uppercase;
}

.btn-search-reset:hover{
   background: linear-gradient(#2C3E50, #648db6);
}

.btn-aula{
   margin-top: 20px;
   width: 100%;
   margin-left: 83.5px;
   background-color: #2C3E50;
   color: #D6EAF8;
   padding: 16px 32px;
   font-family: "Open Sans";
   font-size: 0.9rem;
   border-radius: 30px;
   max-width: max-content;
   border: none;
   text-transform: uppercase;
}

.btn-aula:hover{
   background: linear-gradient(#2C3E50, #648db6);
}

.btn-carrossel{
   margin-top: 42px;
   margin-left: 84.5px;
}

.aula-content {
   position: relative;
   width: 300px;
   height: 420px;
   opacity: 1; /* Deixe a opacidade 1 para tornar visível */
   z-index: 1;
}
</style>
