<template>
  <div id="app">
    <Header v-if="showHeaderFooter" />
    <main>
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
#app {
  /* text-align: center;
  font-family: 'Poppins', sans-serif; */
  background-color: var(#fdfcfe);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/* 
main {
  flex: 1;
  padding: 20px;
} */
</style>
