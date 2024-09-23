<template>
  <div class="forgot-password-page">
    <ForgotPasswordComponent />
  </div>
</template>

<script>
import ForgotPasswordComponent from '@/components/auth/ForgotPassword.vue';

export default {
  components: {
    ForgotPasswordComponent,
  },
};
</script>

<style scoped>
.forgot-password-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
