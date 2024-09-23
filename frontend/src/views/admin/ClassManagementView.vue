<template>
    <div>
      <ClassManagementComponent />
    </div>
  </template>
  
  <script>
  import ClassManagementComponent from '@/components/admin/ClassManagement.vue';
  
  export default {
    name: 'ClassManagementView',
    components: {
      ClassManagementComponent,
    },
  };
  </script>
  
  <style scoped>
  /* Adicione estilos específicos para a view se necessário */
  </style>
  