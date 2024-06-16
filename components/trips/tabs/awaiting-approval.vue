<template>
  <rental-cards :rentals_ids="AwaitingApprovalReservations.map((reservation) => reservation.rental)"/>
</template>
<script setup lang="ts">

import RentalCards from "~/components/trips/tabs/rental-cards.vue";

const {token} = useDirectusToken()

const AwaitingApprovalReservations = ref([])

const fetchAwaitingApprovalReservations = async () => {
  try {
    AwaitingApprovalReservations.value = await $fetch('/api/trips/awaiting-bookings', {
      body: {token: token.value},
      method: 'POST'
    },)
  } catch (e) {
    console.error('Ошибка при получении ожидающих подтверждения бронирований:', e);
  } finally {
  }
};

onMounted(() => {
  fetchAwaitingApprovalReservations()
})
</script>
<style scoped>

</style>