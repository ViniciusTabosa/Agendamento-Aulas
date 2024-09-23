<template>
    <div>
      <UserListComponent />
    </div>
  </template>
  
  <script>
  import UserListComponent from '@/components/admin/UserManagement.vue';
  
  export default {
    name: 'UserListView',
    components: {
      UserListComponent,
    },
  };
  </script>
  
  <style scoped>
  </style>