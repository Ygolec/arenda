<template>
  <v-card flat>
<rental-cards
  </v-card>
</template>
<script setup lang="ts">
import RentalCards from "~/components/search/rental-cards.vue";

const {token} = useDirectusToken()

const upcomingReservations = ref([])

const fetchUpcomingReservations = async () => {
  try {
    upcomingReservations.value = await $fetch('/api/reservations/upcoming-bookings', {
      body: {token: token.value},
      method: 'POST'
    },)
  } catch (e) {
    console.error('Ошибка при получении предстоящих бронирований:', e);
  } finally {
  }
};

onMounted(() => {
  fetchUpcomingReservations()
})
</script>
<style scoped>

</style>