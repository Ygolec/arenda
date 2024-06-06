<template>
  <v-sheet class="ma-3">
    <tabs-of-bookings/>
  </v-sheet>
</template>
<script setup lang="ts">
import TabsOfBookings from "~/components/hosting/reservations/tabs-of-bookings.vue";

definePageMeta({
  layout: 'hosting',
})
</script>
<style scoped>

</style>