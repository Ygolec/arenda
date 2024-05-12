<template>
  <v-container>
    {{ coordinate }}<br>
    {{ bounds }}
    <yandex-map
        v-model="map"
        :settings="{
        location: {
     ...LOCATION
        },
      }"
        width="100%"
        height="500px"
    >
      <yandex-map-default-scheme-layer/>
      <yandex-map-default-features-layer/>
      <yandex-map-default-marker :settings="point"/>
    </yandex-map>
  </v-container>

</template>

<script setup lang="ts">
import {
  YandexMap,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapDefaultSchemeLayer
} from "vue-yandex-maps";
import {shallowRef} from "vue";
import type {LngLat, YMap, YMapLocationRequest} from "@yandex/ymaps3-types";




const props = defineProps<{
  rental: rental
}>()


const {getItemById} = useDirectusItems();

const LOCATION = ref<YMapLocationRequest>({
  center: [37.617644, 55.755819], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
const point = ref({
  coordinates: [37.617644, 55.755819] as LngLat,
  title: 'Marker inc #0',
});

const map = shallowRef<null | YMap>(null);
const coordinate = ref<rentals_coordinates>();

const fetchCoordinate = async () => {
  try {
    coordinate.value = await getItemById<rentals_coordinates>({
      collection: 'rentals_coordinate',
      id: props.rental.coordinates_id?.toString()
    });
  } catch (e) {
    console.error('Ошибка при получении координат:', e);
  }
};

const test = await $fetch('https://geocode-maps.yandex.ru/1.x/?apikey=e1a6fad9-632c-4ed2-9f20-dd0cc990c444&geocode=37.617645,55.755817&kind=metro&format=json\n').then(value => console.log(value))
const bounds = ref(map.value?.bounds)
watch(map, () => {
  bounds.value = map.value?.bounds
})

watch(() => props.rental, () => {
  if (props.rental)
    fetchCoordinate().then(
        () => {
          if (coordinate.value) {
            LOCATION.value = {
              center: [Number(coordinate.value.longitude), Number(coordinate.value.latitude)],
              zoom: 15
            }
            point.value = {
              coordinates: [Number(coordinate.value.longitude), Number(coordinate.value.latitude)],
              title: 'Marker inc #0',
            }
          }
        }
    )
}, {immediate: true})

</script>
<style scoped>

</style>