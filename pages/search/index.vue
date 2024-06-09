<template>
  <v-navigation-drawer  v-if="isWidthValid" v-model="drawer" :width="widthInPx">
    <v-container>
      <rental-cards :rentals_coordinates="rentals_coordinates"/>
    </v-container>
  </v-navigation-drawer>
  <search-map @send-rentals-coordinates="readRentalsCoordinatesFromMap" @open-close_side-bar="drawer=!drawer"/>
</template>
<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute()
import {useWindowSize} from '@vueuse/core'
import RentalCards from "~/components/search/rental-cards.vue";


definePageMeta({
  layout: 'search',
})

const drawer = ref<boolean>(true)
const {width} = useWindowSize()
const search_query = ref<search_query>(route.query as unknown as search_query)
const rentals_coordinates = ref<rentals_coordinates[]>([])

function readRentalsCoordinatesFromMap(rentals_coordinatesFromMap: rentals_coordinates[]) {
  rentals_coordinates.value = rentals_coordinatesFromMap
}

watch(
    () => route.query,
    () => {
      search_query.value = route.query as unknown as search_query
    }
)


const percentageWidth = ref<number>(50);

const isWidthValid = computed(() => widthInPx.value > 0);
const widthInPx = computed(() => {
  return (width.value / 100) * percentageWidth.value;
});


</script>
<style scoped>

</style>