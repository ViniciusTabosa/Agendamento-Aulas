<template>
  <div class="reset-password-page">
    <ResetPassword />
  </div>
</template>

<script>
import ResetPassword from '@/components/auth/ResetPassword.vue';

export default {
  components: {
    ResetPassword,
  },
};
</script>

<style scoped>
.reset-password-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
