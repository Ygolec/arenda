<template>
  <cancel-dialog :dialog="cancelDialog" :booking_id="cancelDialogBookingID" @close="cancelDialog=false"
                 @cancel-booking="cancelBooking"/>
  <v-data-table
      :headers="headers"
      :items="upcomingReservations"
  >
    <template v-slot:headers="{ columns }">
      <tr>
        <template v-for="column in columns" :key="column.key">
          <th>
            <span class="mr-2">{{ column.title }}</span>
            <template v-if="column.value === 'tools'">
              <v-btn variant="text" @click="fetchUpcomingReservations()" icon="refresh"></v-btn>
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
    <template v-slot:item.tools="{ item }">
      <td>
        <v-menu location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
                icon="menu"
                variant="text"
                v-bind="props"
            >
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn @click="cancelBookingDialog(item.id)" variant="text">Отклонить бронирование</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </td>
    </template>

  </v-data-table>
</template>
<script setup lang="ts">
import CancelDialog from "~/components/hosting/reservations/cancel-dialog.vue";
import UserDialog from "~/components/hosting/reservations/tabs/user-dialog.vue";

//Всплывающие окно отмены бронирования
const cancelDialog = ref(false)
const cancelDialogBookingID = ref(0)

const {token} = useDirectusToken()
const headers = [
  {title: 'Статус', value: 'status'},
  {title: 'Гости', value: 'guests'},
  {title: 'Въезд', value: 'checkIn'},
  {title: 'Выезд', value: 'checkOut'},
  {title: 'Дата бронирования', value: 'bookingDate'},
  {title: 'Бронируемое жилье', value: 'rental'},
  {title: 'Итоговая цена', value: 'totalPrice'},
  {title: '', value: 'tools'},
]

const status = [
  {title: 'created', translate: 'В ожидание подтверждения', color: 'warning'},
  {title: 'accepted', translate: 'Одобрено', color: 'success'},
  {title: 'canceled', translate: 'Отклонено', color: 'error'},
]
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

function cancelBookingDialog(booking_id: number) {
  cancelDialogBookingID.value = booking_id
  cancelDialog.value = true
}

function cancelBooking(booking_id: number, reason: string) {
  cancelDialog.value = false
  cancelBookingServer(booking_id, reason)
}

const cancelBookingServer = async (booking_id: number, reason: string) => {
  try {
    await $fetch('/api/booking_of_rental/cancel-booking', {
      body: {token: token.value, booking_id: booking_id, reason: reason},
      method: 'POST'
    },)
  } catch (e) {
    console.error('Ошибка при отмены бронирования:', e);
  } finally {
    await fetchUpcomingReservations()
  }
};

onMounted(() => {
  fetchUpcomingReservations()
})
</script>
<style scoped>

</style>