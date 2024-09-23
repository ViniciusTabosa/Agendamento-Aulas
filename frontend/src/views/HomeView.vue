<template>

  <main class="main">
    
    <div class="main-desc">
      <h1 class="desc-Titulo">Transforme sua Vida Através da Música!</h1>
      <p class="desc-texto">Descubra como a música pode mudar vidas! Oferecemos aulas gratuitas de violão, canto, bateria, teclado e violino para todas as idades. Junte-se a nós e libere seu talento!</p>
      <router-link  to="/register"><a href="/" class="btn-cadastro">Cadastrar</a></router-link>
    </div>

    <div class="main-foto"><img src="../fotos/fotoMain.png" alt="Foto com notas e instrumentos"></div>
  </main>

  <section class="historia-bg" id="historia">
        
    <div class="historia-desc">
        <h1 class="historia-titulo">Nossa História: Transformando Vidas Através da Música</h1>
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

  <section class="depoimento-bg">
    <div class="depoimento">
        <h1 class="depoimento-titulo">A Voz dos Nossos Alunos</h1>
        <p>A música conecta o que palavras não conseguem<span class="detalhe">.</span></p>
        
        <div class="slider">
          
          <div class="slides">
            <input type="radio" name="slide" id="slide1" checked>
            <input type="radio" name="slide" id="slide2">
            <input type="radio" name="slide" id="slide3">   
            
            <div class="slider-container1 s1">
              <div class="slide">
                <h3>Ana Luiza, 22 anos – Aulas de Canto</h3>
                <p><span class="detalhe">"</span>As aulas de canto mudaram completamente minha confiança. Sempre quis cantar, mas não sabia por onde começar. Hoje, canto com segurança e até participei de um coral. A equipe é incrível e me deu todo o apoio necessário!<span class="detalhe">"</span></p>
              </div>
              <div class="slide">
                <h3>Pedro Oliveira, 40 anos – Ex-aluno de Canto</h3>
                <p><span class="detalhe">"</span>Participei das aulas de canto há alguns anos, e isso mudou minha percepção sobre o poder da música. Além de aprender a técnica, fiz amigos para a vida toda. Sou muito grato por tudo que vivi aqui!<span class="detalhe">"</span></p>
              </div>
            </div>
            <div class="slider-container2">
              <div class="slide">
                <h3>Lucas Almeida, 15 anos – Aulas de Teclado</h3>
                <p><span class="detalhe">"</span>Nunca pensei que aprender teclado seria tão divertido. Os professores fazem as aulas parecerem um jogo, e em poucos meses já estou tocando músicas inteiras. Esse projeto transformou minha vida!<span class="detalhe">"</span></p>
              </div>
              <div class="slide">
                <h3>Júlia Santos, 28 anos – Aulas de Violino</h3>
                <p><span class="detalhe">"</span>Sempre achei o violino um instrumento lindo, mas complicado. Aqui, com paciência e dedicação, aprendi a tocá-lo. Hoje, sinto orgulho de cada nota que consigo tocar. A música realmente transformou minha vida!<span class="detalhe">"</span></p>
              </div>
           </div>
           <div class="slider-container3">
            <div class="slide">
              <h3>Clara Gomes, 35 anos – Aulas de Violão</h3>
              <p><span class="detalhe">"</span>Sempre quis aprender violão, mas achava que era difícil demais. As aulas me mostraram que com paciência e prática, tudo é possível. Hoje, toco minhas músicas favoritas e até ensinei algumas coisas aos meus filhos.<span class="detalhe">"</span></p>
            </div>
            <div class="slide">
              <h3>Marcos Vinícius, 18 anos – Aulas de Bateria</h3>
              <p><span class="detalhe">"</span>Aprender bateria aqui foi uma experiência única! As aulas são muito dinâmicas e os professores te incentivam a se superar a cada dia. Recomendo a todos que querem aprender um instrumento!<span class="detalhe">"</span></p>
            </div>
          </div>

        </div>
        <div class="navigation">
          <label for="slide1"></label>
          <label for="slide2"></label>
          <label for="slide3"></label>
        </div>
       

      </div>

    </div>

</section>
</template>


<style scoped>

.main{
    width: 100%;
    display: grid;
    grid-template-columns: 600px 1fr;
    height: 400px;
    padding-left: 50px;
    padding-right: 50px;
    margin-top: 50px;
    gap: 50px;
    margin-bottom: 80px;

}


.desc-Titulo{
    font-family: "Bebas Neue", sans-serif;
    font-weight: 400;
    max-width: 20ch;
    font-size: 4rem;
    color: #2C3E50;
    margin-bottom: 30px;
}

.desc-texto{
    font-family: "Open sans", sans-serif;
    font-size: 1rem;
    line-height: 2;
    color: #2F2F2F;
    margin-bottom: 30px;
}

.btn-cadastro{
    padding: 16px 32px;
    font-family: "Open Sans";
    font-size: 0.9rem;
    border-radius: 30px;
    max-width: max-content;
    border: none;
    text-transform: uppercase;
}

.btn-cadastro{
    background-color: #2C3E50;
    color: #D6EAF8;
}

.btn-cadastro:hover{
    background: linear-gradient(#2C3E50, #648db6);
}

.historia-bg{
    background-color: #2C3E50;
    width: 100%;
    height: 950px;
   
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
    color: #F5F1E9;
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

.depoimento-bg {
    
    width: 100%;
    background-image: url("../fotos/natalia-malaia-J1IkXfBlKeE-unsplash\ \(1\)\ 1.png");
    background-repeat: no-repeat;
    background-size: cover;
    height: 700px;
}


.depoimento {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
 
}

.depoimento-titulo {
    font-family: "Bebas Neue", sans-serif;
    font-weight: 400;
    font-size: 4rem;
    color: #F5F1E9;
    text-align: center;
    
    margin-top: 50px;
}

.depoimento p{
    font-family: "Open Sans", sans-serif;
    color: #F5F1E9;
    font-size: 1.5rem;
    font-style: italic;
    margin-bottom: 20px;
}

.slider {
    height: 450px;
    width: 880px;
    /* background-color: #2C3E50; */
    overflow: hidden;
    padding: 30px;
}
.slides{
    display: flex;
    width: 313%;
    justify-content: center;
    align-items: center;
}

input{
    display: none;
}

.slider-container1, .slider-container2, .slider-container3 {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    margin-right: 30px;
    transition: .6s;
}

.slide {
    width: 400px;
    height: 350px;
    background-color: #F5F1E9;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    padding: 30px;
    border-radius: 20px;
}

.navigation{
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.navigation label{
    width: 70px;
    height: 17px;
    border: 3px solid #F5F1E9;
    margin: 6px;
    border-radius: 10px;
    cursor: pointer;
    transition: .6s;
}

label:hover{
    background-color: #2C3E50;
}

.slide h3 {
    font-family: "Open Sans", sans-serif;
    font-size: 1.3rem;
    color: #2F2F2F;
    margin-bottom: 20px;
    background-color: #F5F1E9;
}

.slide p {
    font-family: "Open Sans", sans-serif;
    font-size: 1.15rem;
    color: #2F2F2F;
    font-style: italic;
}

.detalhe{
    color: #F1C40F ;
    font-size: 1rem;
    font-weight: 800;
    display: inline-block;
}

#slide1:checked ~ .s1{
    margin-left: 0;
}

#slide2:checked ~ .s1{
    margin-left: -66.66%;
}

#slide3:checked ~ .s1{
    margin-left: -133.32%;
}

</style> 
