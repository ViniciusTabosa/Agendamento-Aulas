<template>
  <div id="app">
    <Header v-if="showHeaderFooter" />
    <main class="main-container">
      <router-view />
    </main>
    <Footer v-if="showHeaderFooter"/>
  </div>
</template>

<script>
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';

export default {
  components: {
    Header,
    Footer,
  },

  computed: {
    showHeaderFooter() {
      // Condição para não exibir o header/footer em uma rota específica (ex: '/login')
      return this.$route.name !== 'Register'; // Substitua 'Login' pelo nome da rota que você quer ocultar
    }
  }
};
</script>

<style>
*{
    padding: 0px;
    margin: 0px;
    box-sizing: border-box;
}

body{
    background-color: #F5F1E9;
    font-family: "Open Sans";
}

img{
    display: block;
    max-width: 100%;
    height: auto;
}

ul{
    list-style: none;
}

a{
   text-decoration: none;
   display: inline-block;
}

.main-container{
  min-height: calc(100vh - 100px);
}
</style>
