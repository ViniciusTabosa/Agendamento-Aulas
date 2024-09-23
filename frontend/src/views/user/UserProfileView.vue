<template>
  <div>
    <UserProfileComponent />
  </div>
</template>

<script>
import UserProfileComponent from '@/components/user/UserProfile.vue';

export default {
  name: 'UserProfileView',
  components: {
    UserProfileComponent,
  },
};
</script>

<style scoped>
/* Adicione estilos específicos para a view se necessário */
</style>