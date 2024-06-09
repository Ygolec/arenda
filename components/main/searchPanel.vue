<template>
  <v-card width="50vw" rounded="xl">
    <v-card-item>
      <v-row class="align-center ">
        <v-col cols="4">
          <v-autocomplete
              menu-icon=""
              label="Куда?"
              density="comfortable"
              variant="plain"
              v-model="selectedResultOfSearch"
              :items="searchResults"
              :no-filter="true"
              item-title="properties.name"
              @update:search="searching"
              :loading="loading"
              rounded
              clearable
              hide-no-data
              hide-details
          >
            <template v-slot:append>
              <v-divider class="border-opacity-50" vertical></v-divider>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="2">
          <v-menu
              transition="slide-y-transition"
              :close-on-content-click="false"
              location="bottom"
          >
            <template v-slot:activator="{ props }">
              <v-text-field v-model="range_booking.start" v-bind="props" density="comfortable" variant="plain"
                            rounded="xl" label="Когда?"
                            readonly hide-details>
                <template v-slot:append>
                  <v-divider class="border-opacity-50" vertical></v-divider>
                </template>
              </v-text-field>
            </template>
            <v-card class="mt-2">
              <calendar/>
            </v-card>
          </v-menu>
        </v-col>
        <v-col cols="2">
          <v-menu
              transition="slide-y-transition"
              :close-on-content-click="false"
              location="bottom"
          >
            <template v-slot:activator="{ props }">
              <v-text-field v-model="range_booking.end" v-bind="props" density="comfortable" variant="plain"
                            rounded="xl" label="Когда?"
                            readonly hide-details>
                <template v-slot:append>
                  <v-divider class="border-opacity-50" vertical></v-divider>
                </template>
              </v-text-field>
            </template>
            <v-card class="mt-2">
              <calendar/>
            </v-card>
          </v-menu>
        </v-col>
        <v-col cols="3">
          <guest-selector
              :tenant_information="tenant_information"
              @decrement-adults="decrementAdults(tenant_information)"
              @increment-adults="incrementAdults(tenant_information)"
              @decrement-children="decrementChildren(tenant_information)"
              @increment-children="incrementChildren(tenant_information)"
              @decrement-pets="decrementPets(tenant_information)"
              @increment-pets="incrementPets(tenant_information)"
          />
        </v-col>
        <v-col cols="1">
          <v-btn icon="search" @click="search_rental()" variant="tonal" class="bg-black"></v-btn>
        </v-col>

      </v-row>
    </v-card-item>
  </v-card>
</template>
<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute()
import Calendar from "~/components/main/calendar.vue";
import GuestSelector from "~/components/main/searchPanel/guest-selector.vue";
import {
  decrementAdults,
  decrementChildren, decrementPets,
  incrementAdults,
  incrementChildren, incrementPets
} from "~/utils/main/searchPanel/guest-selector";

const searchResults = ref<string[]>([]);
const selectedResultOfSearch = ref<string | null>(null);
const loading = ref(false);
const search = ref();

const tenant_information = ref({
  adults: 1,
  children: 0,
  pets: 0
})

const range_booking = useState<booking_range>('range_search', () => ({start: '', end: ''}))

watch(
    () => route.query,
    () => {
      if (route.query.search) {
        selectedResultOfSearch.value = route.query.search as string
        range_booking.value.start = route.query.checkin as string
        range_booking.value.end = route.query.checkout as string
        tenant_information.value = {
          adults: route.query.adults ? parseInt(route.query.adults as string) : 1,
          children: route.query.children ? parseInt(route.query.children as string) : 0,
          pets: route.query.pets ? parseInt(route.query.pets as string) : 0
        }
      }
    }, {immediate: true}
)

function search_rental() {

  return navigateTo({
    path: '/search',
    query: {
      search: selectedResultOfSearch.value,
      checkin: range_booking.value.start,
      checkout: range_booking.value.end,
      coordinates: searchResults.value[0].geometry.coordinates,
      ...tenant_information.value
    },

  })
}

async function searching(searchQuery: string | null) {
  search.value = searchQuery;
  try {
    loading.value = true;
    searchResults.value = await ymaps3.search({
      text: search.value,
      type: ["toponyms"],
      limit: 5,
    })
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }

}


</script>
<style scoped>

</style>