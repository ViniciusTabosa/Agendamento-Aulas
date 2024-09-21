<template>
  <div class="register-page">
    <RegisterComponent />
  </div>
</template>

<script>
import RegisterComponent from '@/components/auth/Register.vue';

export default {
  components: {
    RegisterComponent,
  },
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
