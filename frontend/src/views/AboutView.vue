<template>

  <section class="historia-bg">
      <div class="historia-desc">
          <div class="bg-titulo">
              <h1 class="historia-titulo">Nossa História: Transformando Vidas Através da Música</h1>
          </div>
          <div class="info">
              <div class="desc1">
                  <h2 class="historia-subtitulo">Quando tudo começou:</h2>
                  <p class="desc-info">Fundada em 2015, nossa ONG surgiu do desejo de levar a música para comunidades que muitas vezes não têm acesso a uma educação musical de qualidade. Desde então, já impactamos mais de 200 alunos, ajudando a realizar sonhos e construir carreiras musicais.</p>
              </div>
              <div class="desc2">
                  <h2 class="historia-subtitulo">Missão:</h2>
                  <p class="desc-info">Nossa missão é democratizar o acesso à educação musical, promovendo o desenvolvimento cultural, social e emocional dos nossos alunos.</p>
                  <h2 class="historia-subtitulo">Visão:</h2>
                  <p class="desc-info">Ser uma referência em ensino musical gratuito e inclusivo, criando oportunidades para talentos emergirem.</p>
                  <h2 class="historia-subtitulo">Valores:</h2>
                  <p class="desc-info">Inclusão, Respeito, Criatividade, Dedicação, Transformação.</p>
              </div>
              <div class="desc3">
                  <h2 class="historia-subtitulo">Nossa equipe:</h2>
                  <p class="desc-info">Nossa equipe é composta por músicos, educadores e voluntários apaixonados pelo ensino e pela música. Juntos, trabalhamos para criar um ambiente acolhedor e inspirador para nossos alunos</p>
              </div>
              <div class="desc4">
                  <h2 class="historia-subtitulo">Como nos encontrar: </h2>
  
                  <p class="desc-info">Estamos localizados no coração de Sobral, ao lado da Praça São João, de fácil acesso tanto para moradores locais quanto para visitantes. Próximo a pontos de ônibus e estacionamentos, facilitando a chegada de alunos e voluntários.</p>
                  <h3 class="h3">Endereço:</h3>
                  <p class="desc-info">Rua das Artes, 123 – Centro, Sobral, CE, 62010-000</p>
  
                  <h3 class="h3">Funcionamento:</h3>
                  <p class="desc-info">Segunda a Sexta-feira: 8h às 21h <br>
                      Sábado: 9h às 14h</p>
                  <h3 class="h3">Contato:</h3>
                  <p class="desc-info">(88) 9 9999-9999</p>                
              </div>
          
            </div>
      </div>
  </section>
  
  </template>
  
  <style scoped>
  
  .historia-bg{
      margin-top: 80px;
      width: 100%;
      height: 950px;
      margin-bottom: 80px;
     
  }
  
  .historia-desc{
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 0 60px;
  }
  
  .historia-titulo{
      font-family: "Bebas Neue", sans-serif;
      max-width: 15ch;
      font-size: 4rem;
      margin-bottom: 50px;
      font-weight: 400;
      padding-left: 50px;
      padding-top: 50px;
  }
  
  .historia-subtitulo{
      font-family: "Open sans", sans-serif;
      font-size: 1.8rem;
      font-weight: 400;
  }
  
  .info{
      padding-top: 50px;
  }
  
  .historia-titulo, .historia-subtitulo, .h3{
      color: #2C3E50;
  }
  
  .historia-titulo{
      color: #F5F1E9;
  }
  
  .bg-titulo{
      background: #2C3E50;
      margin-left: 50px;
  }
  
  .desc-info{
      margin-left: 20px;
      margin-top: 10px;
      margin-bottom: 10px;
      font-family: "Open Sans",sans-serif;
      font-size: 1rem;
      max-width: 80ch;
      color: rgb(7, 7, 7);
      
  }
  
  .h3{
      margin-left: 50px;
      font-family: "Open Sans",sans-serif;
      font-size: 1.2rem;
      font-weight: 400;
  }
  
  .h3 + .desc-info{
      margin-left: 50px;
  }
  
  </style>
  