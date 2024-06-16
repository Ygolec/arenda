<template>
  <v-data-table
      :headers="headers"
      :items="allReservations"
  >
    <template v-slot:headers="{ columns }">
      <tr>
        <template v-for="column in columns" :key="column.key">
          <th>
            <span class="mr-2">{{ column.title }}</span>
            <template v-if="column.value === 'tools'">
              <v-btn variant="text" @click="fetchAllReservations()" icon="refresh"></v-btn>
            </template>
          </th>
        </template>
      </tr>
    </template>
    <template v-slot:item.status="{ item }">
      <td>
        <v-chip :color="status.find(s => s.title === item.status).color">
          {{ status.find(s => s.title === item.status).translate }}
        </v-chip>
      </td>
    </template>
    <template v-slot:item.guests="{ item }">
      <td>
        <user-dialog :key="item.guests" :userID="item.guests"/>
      </td>
    </template>
    <template v-slot:item.checkIn="{ item }">
      <td>{{ new Date(item.checkIn).toLocaleDateString('ru').split('T')[0] }}</td>
    </template>
    <template v-slot:item.checkOut="{ item }">
      <td>{{ new Date(item.checkOut).toLocaleDateString('ru').split('T')[0] }}</td>
    </template>
    <template v-slot:item.bookingDate="{ item }">
      <td>{{ new Date(item.bookingDate).toLocaleDateString('ru').split('T')[0] }}</td>
    </template>

  </v-data-table>
</template>
<script setup lang="ts">
import UserDialog from "~/components/hosting/reservations/tabs/user-dialog.vue";

const {token} = useDirectusToken()
const headers = [
  {title: 'Статус', value: 'status'},
  {title: 'Гости', value: 'guests'},
  {title: 'Въезд', value: 'checkIn'},
  {title: 'Выезд', value: 'checkOut'},
  {title: 'Дата бронирования', value: 'bookingDate'},
  {title: 'Бронируемое жилье', value: 'rental'},
  {title: 'Итоговая цена', value: 'totalPrice'},
  {title: 'Причина отказа', value: 'reason'},
  {title: '', value: 'tools'},
]

const status = [
  {title: 'created', translate: 'В ожидание подтверждения', color: 'warning'},
  {title: 'accepted', translate: 'Одобрено', color: 'success'},
  {title: 'canceled', translate: 'Отклонено', color: 'error'},
  {title: 'completed', translate: 'Законченно', color: ''},

]
const allReservations = ref([])

const fetchAllReservations = async () => {
  try {
    allReservations.value = await $fetch('/api/reservations/all-bookings', {
      body: {token: token.value},
      method: 'POST'
    },)
  } catch (e) {
    console.error('Ошибка при получении всех бронирований:', e);
  } finally {
  }
};


onMounted(() => {
  fetchAllReservations()
})
</script>
<style scoped>

</style>