<template>
  <div id="app">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
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
};
</script>

<style>
#app {
  text-align: center;
  font-family: 'Poppins', sans-serif; /* Fonte elegante */
  background-color: var(#fdfcfe);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

main {
  flex: 1;
  padding: 20px;
}
</style>
