<template>
    <section class="aulas-bg">

<h1>Horários de Aulas: <span class="subTitulo">Encontre o Melhor Momento para Você!</span></h1>
<div class="aulas">

   <div class="aula carrossel">
       <input type="radio" name="violao" id="violao1" checked>
       <input type="radio" name="violao" id="violao2">
       
       <div class="aula-content violao slide1">
           <div class="containerh2">
               <h2>Violão</h2>
           </div>
           <h3>Instrutora: <span class="cargo">Mariana Oliveira</span></h3>
           <div class="desc">
               <div class="dia-hora">
                   <img src="../fotos/calendar (3).png" alt="Icone de um calendário">
                   <div class="dia">
                       <h4>Dia das Aulas:</h4>
                       <ul>
                           <li>Segunda-feira</li>
                           <li>Quarta-feira</li>
                       </ul>
                   </div>
               </div>
               <div class="dia-hora">
                   <img src="../fotos/clock (1).png" alt="Ícone de um relógio">
                   <div class="hora">
                       <h4>Horários:</h4>
                       <ul>
                           <li>09:00-11:00</li>
                       </ul>
                   </div>
               </div>
           </div>
           <router-link to="/register"><a href="cadastroAluno.html" class="btn-aula btn-carrossel">Agendar</a></router-link>
       </div>
       <div class="aula-content violao slide2">
           <div class="containerh2">
               <h2>Violão</h2>
           </div>
           <h3>Instrutor: <span class="cargo">Carlos Ferreira</span></h3>
           <div class="desc">
               <div class="dia-hora">
                   <img src="../fotos/calendar (3).png" alt="Icone de um calendário">
                   <div class="dia">
                       <h4>Dia das Aulas:</h4>
                       <ul>
                           <li>Terça-feira</li>
                           <li>Quinta-feira</li>
                       </ul>
                   </div>
               </div>
               <div class="dia-hora">
                   <img src="../fotos/clock (1).png" alt="Ícone de um relógio">
                   <div class="hora">
                       <h4>Horários:</h4>
                       <ul>
                           <li>14:00-16:00</li>
                       </ul>
                   </div>
               </div>
           </div>
           <router-link to="/register"><a href="cadastroAluno.html" class="btn-aula btn-carrossel">Agendar</a></router-link>
       </div>

       <!-- Controles do carrossel -->
       <div class="controles">
           <label for="violao1"></label>
           <label for="violao2"></label>
       </div>
   </div>

   <!-- Carrossel Canto -->
   <div class="aula carrossel">
       <input type="radio" name="canto" id="canto1" checked>
       <input type="radio" name="canto" id="canto2">
       
       <div class="aula-content canto slide1">
           <div class="containerh2">
               <h2>Canto</h2>
           </div>
           <h3>Instrutora: <span class="cargo">Ana Paula Mendes</span></h3>
           <div class="desc">
               <div class="dia-hora">
                   <img src="../fotos/calendar (3).png" alt="Icone de um calendário">
                   <div class="dia">
                       <h4>Dia das Aulas:</h4>
                       <ul>
                           <li>Segunda-feira</li>
                           <li>Quarta-feira</li>
                       </ul>
                   </div>
               </div>
               <div class="dia-hora">
                   <img src="../fotos/clock (1).png" alt="Ícone de um relógio">
                   <div class="hora">
                       <h4>Horários:</h4>
                       <ul>
                           <li>09:00-11:00</li>
                       </ul>
                   </div>
               </div>
           </div>
           <router-link to="/register"><a href="cadastroAluno.html" class="btn-aula btn-carrossel">Agendar</a></router-link>
       </div>
       <div class="aula-content canto slide2">
           <div class="containerh2">
               <h2>Canto</h2>
           </div>
           <h3>Instrutor:<span class="cargo">João Pedro Santana</span></h3>
           <div class="desc">
               <div class="dia-hora">
                   <img src="../fotos/calendar (3).png" alt="Icone de um calendário">
                   <div class="dia">
                       <h4>Dia das Aulas:</h4>
                       <ul>
                           <li>Terça-feira</li>
                           <li>Quinta-feira</li>
                       </ul>
                   </div>
               </div>
               <div class="dia-hora">
                   <img src="../fotos/clock (1).png" alt="Ícone de um relógio">
                   <div class="hora">
                       <h4>Horários:</h4>
                       <ul>
                           <li>14:00-16:00</li>
                       </ul>
                   </div>
               </div>
           </div>
           <router-link to="/register"><a href="cadastroAluno.html" class="btn-aula btn-carrossel">Agendar</a></router-link>
       </div>

       <!-- Controles do carrossel -->
       <div class="controles">
           <label for="canto1"></label>
           <label for="canto2"></label>
       </div>
   </div>

   <!-- Divs estáticas -->
   <div class="aula teclado">
       <div class="containerh2">
           <h2>Teclado</h2>
       </div>
       <h3>Instrutora: <span class="cargo">Beatriz Souza</span></h3>
       <div class="desc">
           <div class="dia-hora">
               <img src="../fotos/calendar (3).png" alt="Icone de um calendário">
               <div class="dia">
                   <h4>Dia das Aulas:</h4>
                       <ul>
                           <li>Segunda-feira</li>
                           <li>Quarta-feira</li>
                           <li>Quinta-feira</li>
                       </ul>
               </div>
           </div>
           <div class="dia-hora">
               <img src="../fotos/clock (1).png" alt="Ícone de um relógio">
               <div class="hora">
                   <h4>Horários:</h4>
                       <ul>
                           <li>16:00-20:00</li>
                       </ul>
               </div>
           </div>
       </div>
       <router-link to="/register"><a href="cadastroAluno.html" class="btn-aula">Agendar</a></router-link>
   </div>

   <div class="aula violino">
       <div class="containerh2">
           <h2>Violino</h2>
       </div>
       <h3>Instrutora: <span class="cargo">Clara Figueiredo</span></h3>
       <div class="desc">
           <div class="dia-hora">
               <img src="../fotos/calendar (3).png" alt="Icone de um calendário">
               <div class="dia">
                   <h4>Dia das Aulas:</h4>
                       <ul>
                           <li>Segunda-feira</li>
                           <li>Quarta-feira</li>
                           <li>Sábado</li>
                       </ul>
               </div>
           </div>
           <div class="dia-hora">
               <img src="../fotos/clock (1).png" alt="Ícone de um relógio">
               <div class="hora">
                   <h4>Horários:</h4>
                   <ul>
                       <li>09:00-12:00</li>
                       <li>14:00-17:00</li>
                   </ul>
               </div>
           </div>
       </div>
       <router-link to="/register"><a href="cadastroAluno.html" class="btn-aula">Agendar</a></router-link>
   </div>
   
   <div class="aula bateria">
       <div class="containerh2">
           <h2>Bateria</h2>
       </div>
       <h3>Instrutor: <span class="cargo">Rafael Lima</span></h3>
       <div class="desc">
           <div class="dia-hora">
               <img src="../fotos/calendar (3).png" alt="Icone de um calendário">
               <div class="dia">
                   <h4>Dia das Aulas:</h4>
                       <ul>
                           <li>Segunda-feira</li>
                           <li>Terça-feira</li>
                           <li>Quinta-feira</li>
                           <li>Sexta-feira</li>
                       </ul>
               </div>
           </div>
           <div class="dia-hora">
               <img src="../fotos/clock (1).png" alt="Ícone de um relógio">
               <div class="hora">
                   <h4>Horários:</h4>
                   <ul>
                       <li>17:00-21:00</li>
                   </ul>
               </div>
           </div>
       </div>
       <router-link to="/register"><a href="cadastroAluno.html" class="btn-aula">Agendar</a></router-link>
   </div>

</div>
</section>
</template>

<script>
</script>

<style scoped>

/* Estilos básicos */
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

.cargo{
   display: block;
   font-weight: 400;
}

h4, .containerh2 + h3 {
   color: #2f2f2f;
   font-size: 1rem;
   
}

.desc{
   padding: 0 40px;
}

.dia-hora{
   display: grid;
   grid-template-columns: 16px 1fr;
   gap: 0 10px;
}

.dia-hora img{
 margin-top: 3px;
}

.dia{
   margin-bottom: 10px;
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
   position: absolute;
   width: 300px;
   height: 420;
   opacity: 0; 
   transition: opacity 0.5s ease-in-out;
   z-index: 1; /* Garante que o slide ativo esteja no topo */
} 


input#violao1:checked ~ .slide1,
input#violao2:checked ~ .slide2,
input#canto1:checked ~ .slide1,
input#canto2:checked ~ .slide2 {
   opacity: 1;
   visibility: visible; /* Torna o slide visível quando está ativo */
   z-index: 2; /* Garante que o slide ativo esteja no topo */
}

/* Controles do carrossel */
.controles {
   position: absolute;
   bottom: 10px;
   left: 50%;
   transform: translateX(-50%);
   display: flex;
   gap: 10px;
   justify-content: center;
   flex-direction: row;
   z-index: 2;
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