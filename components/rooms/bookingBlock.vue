<template>
  <v-container>
    <v-card>
      <v-card-item class="mb-5">
        <span class="price-number"> ₽{{ props.rental.price }}</span> <span>ночь</span>
      </v-card-item>
      <v-card-text>
        <v-menu

            transition="slide-y-transition"
            :close-on-content-click="false"
            location="bottom"
        >
          <template v-slot:activator="{ props }">
            <v-container>
              <v-row v-bind="props">
                <v-text-field label="Прибытие" v-model="range_booking.start" readonly variant="outlined"></v-text-field>
                <v-text-field label="Выезд" v-model="range_booking.end" readonly variant="outlined"></v-text-field>
              </v-row>
            </v-container>
          </template>
          <v-card>
            <calendar-booking/>
          </v-card>
        </v-menu>
        <v-menu
            transition="slide-y-transition"
            :close-on-content-click="false"
            location="bottom"
        >
          <template v-slot:activator="{ props }">
            <v-container>
              <v-select
                  v-model="selected_tenant"
                  label="Количество гостей"

                  variant="outlined"
                  readonly
                  v-bind="props"
              />
            </v-container>
          </template>

          <v-card min-width="300" variant="elevated">
            <v-card-item>
              <v-row class="align-center ma-1">
                <v-col>
                  Взрослые
                </v-col>
                <v-col>
                  <v-btn
                      icon="mdi:mdi-minus"
                      @click="decrementAdults"
                  />
                  {{ tenant_information.adults }}
                  <v-btn
                      icon="mdi:mdi-plus"
                      @click="incrementAdults"
                  />
                </v-col>
              </v-row>
              <v-row class="align-center ma-1">
                <v-col>
                  Дети
                </v-col>
                <v-col>
                  <v-btn
                      icon="mdi:mdi-minus"
                      @click="decrementChildren"
                  />
                  {{ tenant_information.children }}
                  <v-btn
                      icon="mdi:mdi-plus"
                      @click="incrementChildren"
                  />
                </v-col>
              </v-row>
              <v-row class="align-center ma-1">
                <v-col>
                  Питомцы
                </v-col>
                <v-col>
                  <v-btn
                      icon="mdi:mdi-minus"
                      @click="decrementPets"
                  />
                  {{ tenant_information.pets }}
                  <v-btn
                      icon="mdi:mdi-plus"
                      @click="incrementPets"
                  />
                </v-col>
              </v-row>
            </v-card-item>
          </v-card>
        </v-menu>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="canBook" @click="book_a_rental" color="black" variant="elevated" block>Забронировать</v-btn>
        <v-btn v-if="!canBook" color="black" variant="elevated" readonly block>Вы уже бронируете данное жилье</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">

import CalendarBooking from "~/components/rooms/calendarBooking.vue";

const user = useDirectusUser();
const {token} = useDirectusToken();
const bookings_of_rental = ref<[]>([])

const canBook = computed(() => {
  if (bookings_of_rental.value.length > 0) {
    const books_of_user = bookings_of_rental.value.find((book) => {
      if (book.user_created == user.value?.id) {
        return book
      }
    })
    return !books_of_user;
  }
});

const props = defineProps<{
  rental: rental,
}>()

const tenant_information = ref({
  adults: 1,
  children: 0,
  pets: 0
})

const selected_tenant = computed(() => {
  const totalGuests = tenant_information.value.adults + tenant_information.value.children;
  const totalPets = tenant_information.value.pets;
  let result = `${totalGuests} гост${totalGuests > 1 ? 'ей' : 'ь'}`;
  if (totalPets > 0) {
    result += `, ${totalPets} питомец${totalPets > 1 ? 'ев' : ''}`;
  }
  return result;
});

const range_booking = useState<booking_range>('range_booking')


const decrementAdults = () => {
  if (tenant_information.value.adults > 1) {
    tenant_information.value.adults--;
  }
}

const incrementAdults = () => {
  tenant_information.value.adults++;
}

const decrementChildren = () => {
  if (tenant_information.value.children > 0) {
    tenant_information.value.children--;
  }
}

const incrementChildren = () => {
  tenant_information.value.children++;
}

const decrementPets = () => {
  if (tenant_information.value.pets > 0) {
    tenant_information.value.pets--;
  }
}
const incrementPets = () => {
  tenant_information.value.pets++;
}

async function book_a_rental() {
  if (user.value == null) {
    return navigateTo('/login')
  }
  if (range_booking.value.start && range_booking.value.end) {

    if (token) {
      await $fetch('/api/booking_of_rental/book', {
        body: {
          token: token.value,
          rental_id: props.rental.id,
          start: range_booking.value.start,
          end: range_booking.value.end,
          adults: tenant_information.value.adults,
          children: tenant_information.value.children,
          pets: tenant_information.value.pets
        }, method: 'POST'
      })
    }
  } else {
    console.error('Выберите даты');
  }
}

onMounted(async () => {
  bookings_of_rental.value = await $fetch('/api/rooms/books-of-rental', {params: {rental_id: props.rental.id}})
})
</script>
<style scoped>
.price-number {
  font-weight: 500;
  font-size: 1.375rem;
  line-height: 1.625rem;
}
</style>