<template>
  <div class="categorias-container">

    <!-- Botão para adicionar nova categoria e título -->
    <div class="title-container">
      <h1 class="title">Gerenciamento de Categorias</h1>
    </div>

    <!-- Input de Busca e Filtro -->
    <div class="filters">
      <input
        type="text"
        v-model="searchQuery"
        @input="buscarCategorias"
        placeholder="Digite o nome da categoria"
        class="search-input"
      />
      <button @click="resetarFiltros" class="btn">Resetar Filtros</button>
      <button @click="abrirModalNovaCategoria" class="btn" style="margin-left: 5px;">Nova Categoria</button>
    </div>

    <!-- Tabela de Categorias -->
    <div class="table-wrapper">
      <table class="category-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="categoria in categorias" :key="categoria._id">
            <td>{{ categoria.nome }}</td>
            <td>{{ categoria.descricao }}</td>
            <td class="actions">
              <span @click="verCategoria(categoria)" class="action-icon">
                <i class="fas fa-eye"></i>
              </span>
              <span @click="editarCategoria(categoria)" class="action-icon">
                <i class="fas fa-edit"></i>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Componente de Paginação -->
    <PaginationComponent
      :paginaAtual="paginaAtual"
      :totalPaginas="totalPaginas"
      :totalRegistros="totalCategorias"
      :registrosPorPagina="categoriasPorPagina"
      @pagina-trocada="paginaAtual = $event; buscarCategorias(false)"
    />
    </div>
  </div>

  <!-- Modal para visualizar categoria -->
      <div v-if="verModal" class="modal">
        <div class="modal-content">
          <h2>Detalhes da Categoria</h2>
          <p><strong>Nome:</strong> {{ categoriaSelecionada.nome }}</p>
          <p><strong>Descrição:</strong> {{ categoriaSelecionada.descricao }}</p>
          <button @click="fecharModal" class="btn">Fechar</button>
        </div>
      </div>

      <!-- Modal para editar categoria -->
      <div v-if="editarModal" class="modal">
        <div class="modal-content">
          <h2>Editar Categoria</h2>
          <input v-model="categoriaEditando.nome" placeholder="Nome" class="input-field" />
          <textarea v-model="categoriaEditando.descricao" placeholder="Descrição" class="input-field"></textarea>
          <button @click="salvarEdicao" class="btn" style="margin-right: 10px;">Salvar</button>
          <button @click="fecharModal" class="btn">Cancelar</button>
        </div>
      </div>

      <!-- Modal para adicionar nova categoria -->
      <div v-if="novaCategoriaModal" class="modal">
        <div class="modal-content">
          <h2>Nova Categoria</h2>
          <input v-model="novaCategoria.nome" placeholder="Nome" class="input-field" />
          <textarea v-model="novaCategoria.descricao" placeholder="Descrição" class="input-field"></textarea>
          <button @click="salvarNovaCategoria" class="btn" style="margin-right: 10px;">Salvar</button>
          <button @click="fecharModalNovaCategoria" class="btn">Cancelar</button>
        </div>
      </div>
</template>

<script>
import PaginationComponent from '@/components/shared/Pagination.vue';
import api from "@/utils/api"; 

export default {
  name: 'CategoriasComponent',
  components: {
    PaginationComponent
  },
  data() {
    return {
      categorias: [],
      searchQuery: "",
      paginaAtual: 1,
      totalPaginas: 0,
      totalCategorias: 0,
      categoriasPorPagina: 10,
      verModal: false,
      editarModal: false,
      novaCategoriaModal: false,
      categoriaSelecionada: {},
      categoriaEditando: { nome: '', descricao: ''},
      novaCategoria: { nome: '', descricao: ''},
    };
  },
  methods: {
    // Função para buscar categorias
    async buscarCategorias(resetPage = true) {
      try {

        if (resetPage) {
          this.paginaAtual = 1; 
        }

        // Reseta os contadores e resultados antes de realizar a busca
        this.categorias = [];
        this.totalCategorias = 0;
        this.totalPaginas = 0;

        const queryParam = `?pagina=${this.paginaAtual}&categoriasPorPagina=${this.categoriasPorPagina}`;
        const searchParam = this.searchQuery ? `&searchQuery=${encodeURIComponent(this.searchQuery)}` : '';
  
        const response = await api.get(`/categories/get-categories${queryParam}${searchParam}`);
        
        this.categorias = response.data.categorias;
        this.totalCategorias = response.data.totalCategorias;
        this.totalPaginas = Math.ceil(this.totalCategorias / this.categoriasPorPagina);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    },

    // Resetar filtros
    resetarFiltros() {
      this.searchQuery = "";
      this.paginaAtual = 1;
      this.buscarCategorias();
    },

    // Ver categoria
    verCategoria(categoria) {
      this.categoriaSelecionada = categoria;
      this.verModal = true;
    },

    // Editar categoria
    editarCategoria(categoria) {
      this.categoriaEditando = { ...categoria };
      this.editarModal = true;
    },

    // Salvar edição
    async salvarEdicao() {
      try {
        await api.put(`/admin/update-category/${this.categoriaEditando._id}`, this.categoriaEditando);
        this.editarModal = false;
        this.buscarCategorias();
      } catch (error) {
        console.error("Erro ao salvar edição:", error);
      }
    },

    // Excluir categoria
    async excluirCategoria(id) {
      if (confirm("Você tem certeza que deseja excluir esta categoria?")) {
        try {
          await api.delete(`/categories/${id}`);
          this.buscarCategorias();
        } catch (error) {
          console.error("Erro ao excluir categoria:", error);
        }
      }
    },

    // Abrir modal para nova categoria
    abrirModalNovaCategoria() {
      this.novaCategoriaModal = true;
      this.novaCategoria = { nome: '', descricao: '' };
    },

    // Fechar modal de nova categoria
    fecharModalNovaCategoria() {
      this.novaCategoriaModal = false;
    },

    // Salvar nova categoria
    async salvarNovaCategoria() {
      try {
        await api.post("/admin/create-category", this.novaCategoria);
        this.fecharModalNovaCategoria();
        this.buscarCategorias();
      } catch (error) {
        console.error("Erro ao salvar nova categoria:", error);
      }
    },

    // Fechar modais
    fecharModal() {
      this.verModal = false;
      this.editarModal = false;
    },
  },
  mounted() {
    this.buscarCategorias();
  },
};
</script>

<style scoped>
.categorias-container {
  padding: 20px;
  margin: 0 auto;
  position: relative;
}

.title-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.table-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.table-details {
  max-width: 1000px;
}

.title {
  text-align: center;
  color: #6e56cf;
  font-size: 2rem;
  margin-bottom: 20px;
}

.nova-categoria-btn {
  position: absolute;
  top: 0;
  right: 0;
  margin: 20px;
}

.filters {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 50%;
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

.table-wrapper {
  overflow-x: auto;
  margin-top: 20px;
}

.category-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
}

.category-table th,
.category-table td {
  padding: 10px;
  border: 1px solid #e2e8f0;
  text-align: left;
}

.category-table th {
  background-color: #6b46c1;
  color: white;
}

.actions {
  display: flex;
  gap: 10px;
}

.action-icon {
  cursor: pointer;
  font-size: 1.2rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

.input-field {
  display: block;
  width: 95%;
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 5px;
}
</style>
