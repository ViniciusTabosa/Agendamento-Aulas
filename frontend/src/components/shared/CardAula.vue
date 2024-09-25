<template>
  <div class="aulas">
    <div class="aula">
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
        <div v-if="aula.temHorarioDisponivel">
          <router-link :to="verDetalhesAula" class="btn-aula btn-carrossel">Agendar Aula</router-link>
        </div>
        <p v-else class="indisponivel">Indisponível</p>
      </div>
    </div>
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

/* Estilos básicos */
.subTitulo{
  display: block;
}

.aulas {
   width: 1000px;
   display: grid;
   grid-template-columns: repeat(3, 300px);
   grid-template-rows: repeat(2, 420px);
   gap: 40px;
   justify-content: center;
   align-items: center;
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

/* Ocultar inputs */
input[type="radio"] {
   display: none;
}

/* Estilo para o conteúdo de cada slide */
.aula-content {
   position: relative;
   width: 300px;
   height: 420px;
   opacity: 1; /* Deixe a opacidade 1 para tornar visível */
   z-index: 1;
}



input#violao1:checked ~ .slide1,
input#violao2:checked ~ .slide2,
input#canto1:checked ~ .slide1,
input#canto2:checked ~ .slide2 {
   opacity: 1;
   visibility: visible; /* Torna o slide visível quando está ativo */
   z-index: 2; /* Garante que o slide ativo esteja no topo */
}

.controles label {
   display: inline-block;
   width: 70px;
   height: 17px;
   border: 3px solid #2C3E50;
   border-radius: 10px;
   cursor: pointer;
  
}

.controles label:hover{
   background-color: #2C3E50;
}
</style>