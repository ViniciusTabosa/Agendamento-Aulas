<template>
  <div class="pagination-container">
    <!-- Contador de registros, sempre visível -->
    <div class="table-info">
      {{ primeiroRegistro }} a {{ ultimoRegistro }} de {{ totalRegistros }} registros
    </div>
    
    <!-- Paginação, visível apenas se houver mais de uma página -->
    <div class="pagination" v-if="totalPaginas > 1">
      <span v-if="paginaAtual > 1" @click="paginaAnterior" class="link">Anterior</span>

      <span v-if="paginaInicio > 1" class="reticencias">...</span>

      <span 
        v-for="pagina in paginasVisiveis" 
        :key="pagina" 
        :class="{ 'active': paginaAtual === pagina }"
        @click="irParaPagina(pagina)" 
        class="link">
        {{ pagina }}
      </span>

      <span v-if="paginaFim < totalPaginas" class="reticencias">...</span>

      <span v-if="paginaAtual < totalPaginas" @click="proximaPagina" class="link">Próxima</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginationComponent',
  props: {
    paginaAtual: {
      type: Number,
      default: 1,
    },
    totalPaginas: {
      type: Number,
      required: true,
    },
    totalRegistros: {
      type: Number,
      required: true,
    },
    registrosPorPagina: {
      type: Number,
      default: 6,
    },
    maxPaginasVisiveis: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    // Calcula o primeiro registro exibido
    primeiroRegistro() {
      if (this.totalRegistros === 0) return 0;
      return (this.paginaAtual - 1) * this.registrosPorPagina + 1;
    },
    // Calcula o último registro exibido
    ultimoRegistro() {
      if (this.totalRegistros === 0) return 0;
      const ultimo = this.paginaAtual * this.registrosPorPagina;
      return ultimo > this.totalRegistros ? this.totalRegistros : ultimo;
    },
    // Calcula a página de início e fim da lista de páginas visíveis
    paginaInicio() {
      return Math.max(1, this.paginaAtual - Math.floor(this.maxPaginasVisiveis / 2));
    },
    paginaFim() {
      return Math.min(this.totalPaginas, this.paginaInicio + this.maxPaginasVisiveis - 1);
    },
    paginasVisiveis() {
      const paginas = [];
      for (let i = this.paginaInicio; i <= this.paginaFim; i++) {
        paginas.push(i);
      }
      return paginas;
    }
  },
  methods: {
    irParaPagina(pagina) {
      this.$emit('pagina-trocada', pagina);
    },
    paginaAnterior() {
      if (this.paginaAtual > 1) {
        this.irParaPagina(this.paginaAtual - 1);
      }
    },
    proximaPagina() {
      if (this.paginaAtual < this.totalPaginas) {
        this.irParaPagina(this.paginaAtual + 1);
      }
    }
  }
};
</script>

<style scoped>
/* Estilo principal para o contêiner de paginação */
.pagination-container {
  display: flex;
  justify-content: space-between; 
  align-items: center; 
  width: 98%; 
  margin-top: 25px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination .link {
  margin: 0 8px;
  cursor: pointer;
  color: #2C3E50;
  text-decoration: none;
}

.pagination .link:hover {
  color: #1A2A38;
}

.pagination .active {
  font-weight: bold;
}

.reticencias {
  margin: 0 5px;
  color: #2C3E50;
}

.table-info {
  font-size: 14px;
  color: #555;
}
</style>
