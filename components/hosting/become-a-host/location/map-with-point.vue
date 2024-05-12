<template>
  <yandex-map
      v-model="map"
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
    <yandex-map-default-marker :settings="point"/>
    <yandex-map-listener
        :settings="{
      onUpdate: () => {
        onUpdateMap();
      }
    }"/>
  </yandex-map>
  {{ point }}
</template>
<script setup lang="ts">

import {
  YandexMap,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapDefaultSchemeLayer, YandexMapListener
} from "vue-yandex-maps";
import type {BehaviorType, LngLat, YMap, YMapLocationRequest} from "@yandex/ymaps3-types";
import {shallowRef} from "vue";

const map = shallowRef<null | YMap>(null);
const enabledBehaviors = ref<BehaviorType[]>(['drag', 'scrollZoom']);
const LOCATION = ref<YMapLocationRequest>({
  center: [37.617644, 55.755819],
  zoom: 9,
});
const point = ref({
  coordinates: [37.617644, 55.755819] as LngLat,
});

const onUpdateMap = () => {
  triggerRef(map);
}

watch(map, (newMap, oldMap) => {
  if (newMap) {
    if (newMap.bounds !== oldMap?.bounds)
      point.value.coordinates = newMap.center as LngLat;
  }
});
</script>
<style scoped>

</style>