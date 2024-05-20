<template>
  <v-stepper style="display: flex;flex-direction: column;" height="100%" v-model="stepper">
    <stepper-headers/>
    <v-stepper-window>
      <v-stepper-window-item value="3">
        <v-container>
          <v-row justify="center">
            <v-sheet>
              <v-card max-width="800">
                <v-select
                    label="Страна"
                    variant="solo"
                    model-value="Россия"
                    readonly/>
                <v-text-field
                    label="Улица,дом"
                    v-model="location.full_address"
                    hide-details/>
                <v-text-field
                    label="Квартира"
                    v-model="location.rental_number"
                    hide-details/>
                <v-text-field
                    label="Город/Деревня"
                    v-model="location.city"
                    hide-details/>
                <v-text-field
                    label="Индекс"
                    v-model="location.index"
                    hide-details/>

              </v-card>
              <v-divider class="ma-5"/>
              <v-card max-width="800">
                <yandex-map
                    :v-model="map"
                    :settings="{
                      location: {
                        ...LOCATION
                      },
                      behaviors: enabledBehaviors,
                    }"
                    width="500px"
                    height="500px">
                  <yandex-map-default-scheme-layer/>
                  <yandex-map-default-features-layer/>
                  <yandex-map-controls :settings="{ position: 'top' }">
                    <yandex-map-control :settings="{ transparent: true }">
                      <v-autocomplete
                          v-model="selectedResultOfSearch"
                          :items="searchResults"
                          :no-filter="true"
                          item-title="properties.name"
                          @update:search="searching"
                          style="width: 400px"
                          variant="solo"
                          :loading="loading"
                          rounded
                          clearable
                          hide-no-data
                      >

                      </v-autocomplete>
                    </yandex-map-control>
                  </yandex-map-controls>
                  <yandex-map-default-marker v-if="selectedResultOfSearch" :settings="point"/>
                </yandex-map>
              </v-card>
            </v-sheet>
          </v-row>
        </v-container>
      </v-stepper-window-item>
      <v-stepper-window-item value="4">
        <v-container>
          <v-row justify="center">
            <v-sheet>
              <v-card max-width="800">
                <map-with-point @update="updateSelectedPoint" :selected-point="point.coordinates"/>
              </v-card>
            </v-sheet>
          </v-row>
        </v-container>
      </v-stepper-window-item>
    </v-stepper-window>
    <v-stepper-actions
        class="mt-auto"
        :disabled="disabled"
        @click:next="next"
        @click:prev="prev"
        next-text="Дальше"
        prev-text="Назад"
    >
    </v-stepper-actions>
  </v-stepper>
  {{ rental }}
</template>
<script setup lang="ts">
import StepperHeaders from "~/components/hosting/become-a-host/stepper-headers.vue";
import {
  YandexMap, YandexMapControl,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer, YandexMapDefaultMarker,
  YandexMapDefaultSchemeLayer,
} from "vue-yandex-maps";
import type {BehaviorType, LngLat, YMap, YMapLocationRequest} from "@yandex/ymaps3-types";
import {shallowRef} from "vue";
import MapWithPoint from "~/components/hosting/become-a-host/location/map-with-point.vue";

const {updateItem} = useDirectusItems();
const {getItemById} = useDirectusItems();


const user = useDirectusUser();

const route = useRoute()
const stepper = ref(0)
const step = ref(8)
const LOCATION = ref<YMapLocationRequest>({
  center: [37.617644, 55.755819],
  zoom: 9,
});
const map = shallowRef<null | YMap>(null);
const rental = ref<rental>()
const enabledBehaviors = ref<BehaviorType[]>([]);
const searchResults = ref<string[]>([]);
const selectedResultOfSearch = ref<string | null>(null);
const detailsOfSelectedResult = ref();
const detailsForForm = ref();
const search = ref();
const loading = ref(false);
const rental_location_id = ref();
const selectedPointCoordinate = ref()
const updateSelectedPoint = (newCoordinates: LngLat) => {
  selectedPointCoordinate.value = newCoordinates
  console.log(selectedPointCoordinate.value)
}
const location = ref<location>(
    {
      full_address: '',
      city: '',
      index: '',
      rental_number: '',
      country: '',
    }
)
const point = ref({
  coordinates: [37.617644, 55.755819] as LngLat,
});

async function next() {
  console.log(stepper.value)
  if (stepper.value === 2) {
    await updateConveniencesOfRentals();
  }
  stepper.value++;

  if (stepper.value > 3) {
    await updateCoordinateOfRental()
    return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value]}`)
  }

}

function prev() {
  if (stepper.value < 3) {
    return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value - 1]}`)
  } else stepper.value--
}

const disabled = computed(() => {
  if (stepper.value === 0) {
    if (!selectedResultOfSearch.value) {
      return true
    } else if (stepper.value === step.value) {
      return 'prev'
    } else {
      return 'next'
    }
  } else {
    if (!selectedResultOfSearch.value) {
      return 'next'
    } else if (stepper.value === step.value) {
      return 'next'
    }
  }
});

const updateCoordinateOfRental = async () => {
  try {

    if (rental.value && selectedPointCoordinate.value){
      if (rental.value.coordinates_id) {
        console.log(321)
        await updateItem({
          collection: "rentals_coordinate",
          id: rental.value.coordinates_id.toString(),
          item: {
            longitude: selectedPointCoordinate.value[0],
            latitude: selectedPointCoordinate.value[1],
          }
        });
      }
      if (user.value && !rental.value.coordinates_id) {
        console.log(123)
        await $fetch('/api/rentals_coordinate/create-by-user', {
          body: {
            coordinates: selectedPointCoordinate.value,
            user_id: user.value.id,
            rental_id: route.params.id,
          },
          method: 'POST'
        })
      }
    }
  } catch (e) {
  }
}

const updateConveniencesOfRentals = async () => {
  try {
    await updateItem({
      collection: "location",
      id: rental_location_id.value.toString(),
      item: {
        full_address: location.value.full_address,
        city: location.value.city,
        index: location.value.index,
        rental_number: location.value.rental_number,
        country: location.value.country,
      }
    });
  } catch (e) {
  }
}

const fetchLocationIDOfRentals = async () => {
  try {
    const response: any = await getItemById<rental>({
      collection: "rentals",
      id: route.params.id.toString(),
      params: {
        fields: ["location_id"]
      }
    });
    if (response.location_id !== null) {
      rental_location_id.value = response.location_id
    }
  } catch (e) {
  }
};

const fetchRental = async () => {
  try {
    const response: any = await getItemById<rental>({
      collection: "rentals",
      id: route.params.id.toString(),
    });
    if (response !== null) {
      rental.value = response
    }
  } catch (e) {
  }
};

async function searching(searchQuery: string | null) {
  search.value = searchQuery;
  try {
    loading.value = true;
    searchResults.value = await ymaps3.search({
      text: search.value,
      limit: 5,
    })
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }

}

watch(selectedResultOfSearch, async () => {
  detailsOfSelectedResult.value = searchResults.value.find((result) => result.properties.name === selectedResultOfSearch.value)
  if (detailsOfSelectedResult.value != undefined) {
    LOCATION.value = {
      center: detailsOfSelectedResult.value.geometry.coordinates,
      zoom: 14
    }
    point.value = {
      coordinates: detailsOfSelectedResult.value.geometry.coordinates,
    }
    try {
      detailsForForm.value = await $fetch('/api/yandex_geocode/search', {params: {coordinates: `${detailsOfSelectedResult.value.geometry.coordinates[0]},${detailsOfSelectedResult.value.geometry.coordinates[1]}`}})
    } catch (e) {
      console.error(e);
    } finally {
      if (detailsForForm.value) {
        location.value = {
          full_address: detailsForForm.value.full_address,
          city: detailsForForm.value.city,
          index: detailsForForm.value.index,
          rental_number: detailsForForm.value.rental_number,
          country: detailsForForm.value.country,
        }

      }
    }
  }
})


onMounted(async () => {
  stepper.value = 2
  await fetchLocationIDOfRentals();
  await fetchRental();
});
</script>
<style scoped>

</style>