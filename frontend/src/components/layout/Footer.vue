<template>
  
  <body>
      <footer class="rodape-bg">
          <div class="rodape">
      
            <img src="../../fotos/logoMaiorBranca.png" alt="" width="203" height="48">
      
                  <div class="rodape-contato">
                      <h2>Contato</h2>
                      <ul>
                          <li><a href="tel:+558899999999">+55 88 9999-9999</a></li>
                          <li><a href="mailto:vozeseacordes@gmail.com">vozeseacordes@gmail.com</a></li>
                          <li>Rua das Artes, 123 – Centro</li>
                          <li>Sobral - CE</li>
                       </ul>
                       <div class="rede-sociais">
                          <a href="./"><img src="../../fotos/instagram.png" alt="instagram" width="32" height="32"></a>
                          <a href="./"><img src="../../fotos/facebook.png" alt="facebook" width="32" height="32"></a>
                          <a href="./"><img src="../../fotos/youtube.png" alt="youtube" width="32" height="32"></a>
                       </div>
                  </div>
      
                  <div class="rodape-info">
                      <h2>Informações</h2>
                      <nav>
                          <ul>
                              <li><a href="/about">Quem Somos</a></li>
                              <li><a href="/instrutores">Nossos Instrutores</a></li>
                              <li><a href="/aulas">Nossas Aulas</a></li>
      
                          </ul>
                      </nav>
                  </div>
                  <p>Vozes e Acordes © Alguns direitos reservados.</p>
          </div>
      
        </footer>
  </body>
  </template>
  
  <script>
  export default {
    name: 'FooterComponent',
  };
  </script>
  
  <style scoped>
  
  
  .rodape-bg{
      background-color: #2C3E50;
      height: 480px;
  }
  
  .rodape{
      display: grid;
      grid-template-columns: 3fr 5fr 4fr;
      gap: 40px;
      padding-top: 60px;
  
  }
  
  .rodape img{
      margin-left: 50px;
  }
  
  .rodape h2{
      margin-bottom: 32px;
      color: #F5F1E9;
      font-family: "Bebas Neue", sans-serif;
      font-size: 1.5rem;
      letter-spacing: 2px;
      font-weight: 400;
  }
  
  .rodape-contato ul{
      margin-bottom: 32px;
  }
  
  .rodape-contato li:nth-child(even):after{
      content: '';
      display: block;
      max-width: 360px;
      height: 2px;
      background: #fcfcfc18;
      margin-top: 16px;
  }
  
  .rodape li{
      margin-bottom: 16px;
      color: #F5F1E9;
      font-family: "Open sans", sans-serif;
  }
  
  .rede-sociais{
      display: flex;
      gap: 32px;
  }
  
  .rodape a{
      color: #F5F1E9;
  }
  
  .rodape a:hover{
      color: #f5f1e975;
  }
   .rodape p{
      color: #F5F1E9;
      margin-left: 50px;
      font-family: "Open sans", sans-serif;
   }
  </style>
  