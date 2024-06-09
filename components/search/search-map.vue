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
    <yandex-map-controls :settings="{ position: 'top right' }">
      <yandex-map-control :settings="{ transparent: true }">
        <v-btn @click="openFilterDialog()">Фильтры</v-btn>
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
      // onUpdate: () => {
      // },
      // onStateChanged: () => {
      // },
      onActionEnd: () => {
        onUpdateMap();
      }

    }"/>


  </yandex-map>
  <filter-dialog @close="filter_dialog=false" @save_filters="update_after_save_filter()" :dialog="filter_dialog"/>
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
import {useRoute} from "vue-router";
import FilterDialog from "~/components/search/filter-dialog.vue";

const router = useRouter()
const route = useRoute()

const emit = defineEmits<{
  (e: 'open-close_sideBar'): void
  (e: 'sendRentalsCoordinates', rentals_coordinates: rentals_coordinates[]): void
}>()


const LOCATION = ref<YMapLocationRequest>({
  center: [55.76, 37.64],
  zoom: 10,
});

const map = shallowRef<null | YMap>(null);
const openMarker = ref<null | number>(null);
const bounds = ref<LngLatBounds>([[0, 0], [0, 0]]);
const markers = ref<{ coordinates: LngLat }[]>([])
const rentals_coordinates = ref<rentals_coordinates[]>([]);
const rentals = ref<rental[]>([]);
const filter_dialog = ref<boolean>(false);


function update_after_save_filter(){
  filter_dialog.value = false;
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
}

const fetchRentalsCoordinates = async () => {
  try {
    rentals_coordinates.value = await $fetch('/api/search/get-coordinates-of-rentals-search', {
      body: {
        bounds: bounds.value,
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
    emit('sendRentalsCoordinates', rentals_coordinates.value);
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
  router.push({
    path: '/search',
    query: {
      ...route.query,
      bounds_lt: bounds.value[0],
      bounds_rb: bounds.value[1],
      zoom: map.value?.zoom,
    }
  })
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

watch(
    () => route.query.search,
    () => {
      LOCATION.value.center = route.query.coordinates
      LOCATION.value.zoom = route.query.zoom || 10
      LOCATION.value.bounds = undefined
    }
)

function openFilterDialog() {
  filter_dialog.value = true
}

onMounted(() => {
  if (route.query.bounds_lt && route.query.bounds_rb) {
    LOCATION.value.bounds = [route.query.bounds_lt, route.query.bounds_rb]
  }
})
</script>
<style scoped>

</style>