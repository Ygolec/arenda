<template>
  <v-dialog
      :model-value="props.dialog"
      width="auto"
  >
    <v-card
        width="50rem"
    >
      <v-toolbar color="white">
        <v-btn
            icon="mdi:mdi-close"
            @click="emit('close');"
        ></v-btn>
        <v-card-title>Фильтры</v-card-title>
      </v-toolbar>
      <v-divider/>
      <v-card-title>Комнаты и кровати</v-card-title>
      <v-card-item>
        <v-card-title>Спальни</v-card-title>
        <v-chip-group
            v-model="bedrooms"
            selected-class=""
            mandatory
        >
          <v-chip
              filter
              v-for="size in sizes"
              :key="size.value"
              :text="size.text"
              :value="size.value"
              selected-class="bg-white"
              variant="elevated"
          ></v-chip>
        </v-chip-group>
        <v-card-title>Кровати</v-card-title>
        <v-chip-group
            v-model="beds"
            selected-class=""
            mandatory
        >
          <v-chip
              filter
              v-for="size in sizes"
              :key="size.value"
              :text="size.text"
              :value="size.value"
              selected-class="bg-white"
              variant="elevated"
          ></v-chip>
        </v-chip-group>
        <v-card-title>Ванные</v-card-title>
        <v-chip-group
            v-model="bathrooms"
            selected-class=""
            mandatory
        >
          <v-chip
              filter
              v-for="size in sizes"
              :key="size.value"
              :text="size.text"
              :value="size.value"
              selected-class="bg-white"
              variant="elevated"
          ></v-chip>
        </v-chip-group>
      </v-card-item>
      <v-divider/>
      <v-card-title>Удобства</v-card-title>
      <v-card-item>
        <v-row>
          <v-col
              v-if="conveniences_of_rentals"
              v-for="(convenience, index) in conveniences_of_rentals"
              cols="4">
            <v-checkbox
                :prepend-icon="convenience.icon"
                :label="convenience.name"
                :value="convenience.id"
                v-model="selectedConveniences"
            >

            </v-checkbox>
          </v-col>
        </v-row>
      </v-card-item>
      <v-card-actions>
        <v-btn @click="emit('save_filters')">Показать {{ rentals_coordinates.length }} жилье</v-btn>
        <!--        <v-btn @click="fetchRentalsCoordinates()">чек</v-btn>-->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {useRoute} from "vue-router";

const {getItems} = useDirectusItems();
const route = useRoute()
const router = useRouter()

const props = defineProps({
  dialog: Boolean,
})
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save_filters'): void
}>()


const conveniences_of_rentals = ref<type_of_rental[]>([]);
const selectedConveniences = ref([]);
const beds = ref([0]);
const bathrooms = ref([0]);
const bedrooms = ref([0]);
const sizes = ref([
  {text: 'Не важно', value: undefined},
  {text: '1', value: 1},
  {text: '2', value: 2},
  {text: '3', value: 3},
  {text: '4', value: 4},
  {text: '5', value: 5},
  {text: '6', value: 6},
  {text: '7', value: 7},
  {text: '8+', value: 8},
]);
const rentals_coordinates = ref<rentals_coordinates[]>([]);

const fetchConveniencesOfRentals = async () => {
  try {
    conveniences_of_rentals.value = await $fetch('/api/conveniences/get-all-conveniences', {
      method: 'GET'
    })
  } catch (e) {
  }
};

watch(selectedConveniences, () => {
  router.push({
    path: '/search',
    query: {
      ...route.query,
      amenities: selectedConveniences.value
    }
  }).then(() => {
    fetchRentalsCoordinates()
  })
})

watch(beds, () => {
  router.push({
    path: '/search',
    query: {
      ...route.query,
      min_beds: beds.value
    }
  }).then(() => {
    fetchRentalsCoordinates()
  })
})

watch(bedrooms, () => {
  router.push({
    path: '/search',
    query: {
      ...route.query,
      min_bedrooms: bedrooms.value
    }
  }).then(() => {
    fetchRentalsCoordinates()
  })
})

watch(bathrooms, () => {
  router.push({
    path: '/search',
    query: {
      ...route.query,
      min_bathrooms: bathrooms.value
    }
  }).then(() => {
    fetchRentalsCoordinates()
  })
})

const fetchRentalsCoordinates = async () => {
  try {
    rentals_coordinates.value = await $fetch('/api/search/get-coordinates-of-rentals-search', {
      body: {
        bounds: [[parseFloat(route.query.bounds_lt[0]), parseFloat(route.query.bounds_lt[1])], [parseFloat(route.query.bounds_rb[0]), parseFloat(route.query.bounds_rb[1])]],
        checkin: route.query.checkin,
        checkout: route.query.checkout,
        min_bathrooms: parseInt(route.query.min_bathrooms) || undefined,
        min_beds: parseInt(route.query.min_beds) || undefined,
        min_bedrooms: parseInt(route.query.min_bedrooms) || undefined,
        amenities: Array.isArray(route.query.amenities) ? route.query.amenities.map((id: string) => parseInt(id)) : (route.query.amenities ? [parseInt(route.query.amenities)] : undefined)
      },
      method: 'POST'
    })
  } catch (e) {
    console.error('Ошибка при получении координат аренды:', e);
  } finally {
  }
};

onMounted(() => {
  fetchConveniencesOfRentals()
  fetchRentalsCoordinates()
  bedrooms.value = route.query.min_bedrooms ? [parseInt(route.query.min_bedrooms as string)] : [0]
  bathrooms.value = route.query.min_bathrooms ? [parseInt(route.query.min_bathrooms as string)] : [0]
  beds.value = route.query.min_beds ? [parseInt(route.query.min_beds as string)] : [0]
  selectedConveniences.value = Array.isArray(route.query.amenities) ? route.query.amenities.map((id: string) => parseInt(id)) : (route.query.amenities ? [parseInt(route.query.amenities)] : undefined)
})
</script>
<style scoped>

</style>