<template>
  <yandex-map
      v-model="map"
      :settings="{
        location: {
     ...LOCATION
        },
      }"
      width="100%"
      height="100%"
  >
    <yandex-map-default-scheme-layer/>
    <yandex-map-default-features-layer/>
    <yandex-map-controls :settings="{ position: 'top left' }">
      <yandex-map-control :settings="{ transparent: true }">

        <v-btn @click="emit('open-close_sideBar')">Скрыть/раскрыть</v-btn>
      </yandex-map-control>
    </yandex-map-controls>

    <yandex-map-marker
        v-if="markers.length > 0 && rentals"
        v-for="(marker, index) in markers"
        :key="rentals[index] ? rentals[index].id : index"
        :settings="{ coordinates: marker.coordinates, onClick: () => openMarker = index, zIndex: openMarker === index ? 1 : 0 }"
    >

      <pop-up_card :key="rentals[index].id" v-if="rentals[index]" :rental_id="rentals[index].id"/>
    </yandex-map-marker>
    <yandex-map-listener
        :settings="{
      onUpdate: () => {
        onUpdateMap();
      }
    }"/>


  </yandex-map>
</template>
<script setup lang="ts">

import PopUp_card from "~/components/pop-up_card.vue";
import {
  YandexMap,
  YandexMapControl,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer, YandexMapListener, YandexMapMarker
} from "vue-yandex-maps";
import type {LngLat, LngLatBounds, YMap, YMapLocationRequest} from "@yandex/ymaps3-types";
import {shallowRef} from "vue";

const props = defineProps<{}>()
const emit = defineEmits<{
  (e: 'open-close_sideBar'): void
}>()


const LOCATION = ref<YMapLocationRequest>({
  center: [37.617644, 55.755819], // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const map = shallowRef<null | YMap>(null);
const openMarker = ref<null | number>(null);
const bounds = ref<LngLatBounds>([[0, 0], [0, 0]]);
const markers = ref<{ coordinates: LngLat }[]>([])
const rentals_coordinates = ref<rentals_coordinates[]>([]);
const rentals = ref<rental[]>([]);


const fetchRentalsCoordinates = async () => {
  try {
    rentals_coordinates.value = await $fetch('/api/rentals/getAllByBetweenCoordinate', {
      body: bounds.value,
      method: 'POST'
    })
  } catch (e) {
    console.error('Ошибка при получении координат аренды:', e);
  }
};


const fetchRentals = async () => {
  try {
    rentals.value = await $fetch('/api/rentals/getInIDs', {
      body: rentals_coordinates.value.map((rentals_coordinate) => rentals_coordinate.rental_id),
      method: 'POST'
    })

  } catch (e) {
    console.error('Ошибка при получении аренды:', e);
  }
};

const onUpdateMap = () => {
  triggerRef(map);
}

watch(map, (newMap, oldMap) => {
  if (newMap) {
    if (newMap.bounds !== oldMap?.bounds)
      bounds.value = newMap.bounds;
  }
});

watch(bounds, () => {
  fetchRentalsCoordinates().then(() => {
    if (rentals_coordinates.value.length > 0) {
      fetchRentals();
      markers.value = rentals_coordinates.value.map((rentals_coordinate) => {
        return {
          coordinates: [parseFloat(rentals_coordinate.longitude), parseFloat(rentals_coordinate.latitude)]
        }
      });
    } else {
      markers.value = [];
      rentals.value = [];
    }
  });
});
</script>
<style scoped>

</style>