<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ props.rental.price }}₽
      </v-card-title>
      <v-card-text>

        <v-menu

            transition="slide-y-transition"
            :close-on-content-click="false"
            location="bottom"
        >
          <template v-slot:activator="{ props }">

            <v-row v-bind="props">
              <v-text-field v-model="range_booking.start" readonly variant="outlined"></v-text-field>
              <v-text-field v-model="range_booking.end" readonly variant="outlined"></v-text-field>
            </v-row>
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
            <v-select
                v-model="selected_tenant"
                label="Количество гостей"

                variant="outlined"
                readonly
                v-bind="props"
            />
          </template>

          <v-card min-width="300">
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
    </v-card>
  </v-container>
</template>

<script setup lang="ts">

import CalendarBooking from "~/components/rooms/calendarBooking.vue";


const props = defineProps<{
  rental: rental
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

</script>
<style scoped>

</style>