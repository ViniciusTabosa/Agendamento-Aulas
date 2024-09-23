<template>


  <body class="body-cadastro">
  
  <section class="cadastro-bg">
  
      <div class="cadastro">
          <div class="cadastro-informacoes">
              <h1 class="cadastro-titulo">
                  Junte-se à Nossa Família Musical!
              </h1>
              <p class="cadastro-subtitulo">Cadastre-se agora e comece sua jornada na música com aulas gratuitas<span class="detalhe">.</span></p>
              <div class="form" >
                  <form @submit.prevent="handleRegister">
                      <div class="nome-sobrenome-form">
                          <div class="campo">
                              <label for="nome">Nome:</label>
                              <input v-model="nome" type="text" name="nome" id="nome" required>
                          </div>
                          <div class="campo">
                              <label for="sobrenome">Sobrenome:</label>
                              <input type="text" name="sobrenome" id="sobrenome" v-model="sobrenome" required>
                          </div>
                      </div>
                      <div class="cpf">
                          <label for="cpf">CPF:</label>
                          <input type="text" name="cpf" id="cpf" v-model="cpf" required>
                      </div>
                      <div class="email">
                          <label for="email">E-mail:</label>
                          <input type="email" name="email" id="email" v-model="email" required>
                      </div>
                      <div class="senha">
                          <label for="senha">Senha:</label>
                          <input type="password" name="senha" id="senha" v-model="senha" required>
                      </div>
                      
                      <div class="div-cadastro">
                          <router-link to="/"><a href="index.html" class="btn btn-login">Voltar</a></router-link>
                          <button type="submit" class="btn btn-cadastrar">Cadastrar</button>
                      </div>
                  </form>
              </div>
          </div>
          <div class="img-cadastro">
              <img src="../../fotos/rukma-pratista-qej8X_erXLg-unsplash.jpg" alt="">
          </div>
  
          <div v-if="message || errorMessage" class="modal-overlay">
            <div class="modal-content">
              <p v-if="errorMessage">{{ errorMessage }}</p>
              <p v-if="message">{{ message }}</p>
              <router-link to="/"><button @click="closeModal" class="fechar btn">Fechar</button></router-link>
            </div>
          </div>
  
      </div>
  
      
  
  </section>
  
  </body>
  
  
   
  </template>
  
  <script>
  import axios from '@/utils/api';
  
  
  export default {
  
    mounted(){
      window.$('#cpf').mask('000.000.000-00');
    },
  
    closeModal() {
        // Função para fechar o modal
        console.log("Fechar modal");
        this.message = '';
        this.errorMessage = '';
      },
  
    name: 'RegisterComponent',
    data() {
      return {
        nome: '',
        sobrenome: '',
        email: '',
        cpf: '',
        senha: '',
        errorMessage: '',
        message: '',
      };
    },
    methods: {
      async handleRegister() {
        try {
          // Buscar o perfil "002" (usuário comum)
          const perfilResponse = await axios.get('/perfis/code/002');
          const perfilId = perfilResponse.data._id;
  
          // Fazer a requisição de criação de conta com o perfilId
          await axios.post('/register', {
            nome: this.nome,
            sobrenome: this.sobrenome,
            email: this.email,
            cpf: this.cpf,
            senha: this.senha,
            perfilId: perfilId,
          });
  
          this.message = 'Conta criada com sucesso! Verifique seu e-mail para confirmar sua conta.';
          this.errorMessage = '';
        } catch (error) {
          if (error.response) {
            alert(error.response.data.error || 'Erro desconhecido.');
          } else {
            this.errorMessage = 'Erro ao criar a conta. Verifique os dados e tente novamente.';
            this.message = '';
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    height: 200px;
    background: #F5F1E9;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }
  
  .modal-content p{
    font-family: "Open Sans", sans-serif;
    font-size: 1.2rem;
    margin-top: 30px;
    margin-bottom: 30px;
    color: #2C3E50;
  }
  
  .fechar {
    margin-top: 10px;
    padding: 10px 20px;
    cursor: pointer;
    background-color: #2C3E50;
      color: #D6EAF8;
  }
  
  .fechar:hover{
    background: linear-gradient(#2C3E50, #648db6);
  }
  
  .body-cadastro{
      height: 100vh;
      display: grid;
      place-items: center;
  } 
  
  .cadastro-bg{
      width: 1000px;
      height: 550px;
      background-color: #2C3E50;
     margin: auto 0;
     border-radius: 50px;
     box-shadow: 5px 5px 20px rgba(71, 94, 136, 0.9);
  }
  
  .cadastro{
      display: grid;
      grid-template-columns: 600px 400px;
      gap: 20px;
  }
  
  .cadastro-informacoes{
      width: 600px;
      padding-top: 30px;
      padding-left: 50px;
  }
  
  .cadastro-titulo{
      font-family: "Bebas Neue", sans-serif;
      font-size: 2.5rem;
      max-width: 20ch;
      color: #F5F1E9;
      letter-spacing: 2px;
      font-weight: 400;
  }
  
  .cadastro-subtitulo{
      font-family: "Open sans", sans-serif;
      font-size: 1rem;
      max-width: 40ch;
      color: #000;
  }
  
  .form{
      width:550px;
      margin-top: 20px;
  }
  
  label{
      font-family: "Open sans", sans-serif;
      font-size: 1rem;
      display: block;
      margin-bottom: 5px;
  
  }
  
  .nome-sobrenome-form{
      display: flex;
  
  }
  
  .campo{
      flex: 1;
  }
  
  .nome-sobrenome-form input{
      width: 220px;
      height: 30px;
      display: inline-block;
      margin-bottom: 10px;
  }
  
  .cpf input, .email input, .senha input{
      width: 495px;
      height: 30px;
      display: inline-block;
      margin-bottom: 10px;
  }
  
  input{
      border-radius: 15px;
      border: none;
      padding-left: 10px;
      font-family: "Open sans", sans-serif;
      font-size: 1rem;
      background-color: #EBE8E1;
  }
  
  input:focus{
      outline: none;
  }
  
  
  .img-cadastro img{
      border-radius: 0 50px 50px 0;
      height: 550px;
      width: 400px;
  }
  
  .div-cadastro{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 80px;
      margin-top: 15px;
  }
  
  .btn-cadastrar{
      background-color: #F1C40F ;
      cursor: pointer;
  }
  
  .btn-cadastrar:hover{
      background: linear-gradient( #F1C40F, #e6760e  );
  }
  
  .btn{
      padding: 16px 32px;
      font-family: "Open Sans";
      font-size: 0.9rem;
      border-radius: 30px;
      max-width: max-content;
      border: none;
      text-transform: uppercase;
  }
  
  .btn-login{
      background-color: #D6EAF8;
      color: #2C3E50;
  }
  
  .btn-login:hover{
      background: linear-gradient( #D6EAF8, #6798C0  );
  }
  
  .detalhe{
      color: #F1C40F ;
      font-size: 1rem;
      font-weight: 400;
      display: inline-block;
  }
  
  </style>
  