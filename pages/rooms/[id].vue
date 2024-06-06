<template>
  <photo-gallery :content_id="rental?.content_id"/>
  {{ rental }}

  <v-row>
    <v-col
        cols="7"
    >
      <convenience v-if="rental?.conveniences_ids" :conveniences_ids="rental?.conveniences_ids"/>
      <v-divider class="mr-15 ml-15"></v-divider>
      <calendar-booking/>
    </v-col>
    <v-col
        cols="5"
    >
      <booking-block v-if="rental" :rental="rental"/>
    </v-col>
  </v-row>
  <v-divider class="mr-15 ml-15"></v-divider>
  <rental-map v-if="rental" :rental="rental"/>
  <v-divider class="mr-15 ml-15"></v-divider>
  <v-spacer class="pb-sm-1"/>
  <comments/>
</template>
<script setup lang="ts">

import PhotoGallery from "~/components/rooms/photoGallery.vue";
import Convenience from "~/components/rooms/convenience.vue";
import BookingBlock from "~/components/rooms/bookingBlock.vue";
import CalendarBooking from "~/components/rooms/calendarBooking.vue";
import RentalMap from "~/components/rooms/rentalMap.vue";
import Comments from "~/components/rooms/comments.vue";


const {getItemById} = useDirectusItems();

const rental = ref<rental>();
const route = useRoute()


definePageMeta({
  layout: 'rooms',
})

const fetchRental = async () => {
  try {
    rental.value = await $fetch('/api/rooms/one-by-id', {params: {rental_id: route.params.id}})
    // rental.value = await getItemById({
    //   collection: 'rentals',
    //   id: route.params.id.toString()
    // });
    // console.log(rental.value)
  } catch (e) {
    console.error('Ошибка при получении жилья:', e);
  }
};

const fetchBookingsDates = async () => {
  try {
    const bookings_dates = await $fetch('/api/booking_of_rental/booking-dates', {params: {rental_id: route.params.id}})
    if (bookings_dates.length > 0) {

      const disabledDates = useState('disabledDates')
      disabledDates.value = bookings_dates
    }
    console.log(bookings_dates)
  } catch (e) {
    console.error('Ошибка при получении дат бронирования:', e);
  }

}


onMounted(async () => {
  await fetchRental()
  await fetchBookingsDates()
})

</script>
<style scoped>

</style>