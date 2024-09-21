<template>
  <div class="reset-password-page">
    <ScheduleDetailsComponent />
  </div>
</template>

<script>
import ScheduleDetailsComponent from '@/components/schedule/ScheduleDetails.vue';

export default {
  components: {
    ScheduleDetailsComponent,
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
