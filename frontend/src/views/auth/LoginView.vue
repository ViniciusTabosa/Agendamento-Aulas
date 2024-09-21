<template>
  <div class="login-page">
    <LoginComponent />
  </div>
</template>

<script>
import LoginComponent from '@/components/auth/Login.vue';

export default {
  components: {
    LoginComponent,
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
