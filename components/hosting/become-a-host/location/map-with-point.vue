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
<!--  {{}}-->
<!--  {{props.selectedPoint}}-->
</template>
<script setup lang="ts">

import {
  YandexMap,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapDefaultSchemeLayer, YandexMapListener
} from "vue-yandex-maps";
import type {BehaviorType, LngLat, YMap, YMapLocationRequest} from "@yandex/ymaps3-types";
import {type PropType, shallowRef} from "vue";

const emit = defineEmits(['update']);

const props = defineProps({
  selectedPoint: {
    type: Object as PropType<LngLat>,
    required: true,
  },
})

const map = shallowRef<null | YMap>(null);
const enabledBehaviors = ref<BehaviorType[]>(['drag', 'scrollZoom']);
const LOCATION = ref<YMapLocationRequest>({
  center: [37.617644, 55.755819],
  zoom: 16,
});
const point = ref({
  coordinates: [37.617644, 55.755819] as LngLat,
  // coordinates: map.center as LngLat,
});

const onUpdateMap = () => {
  triggerRef(map);
  emit('update', point.value.coordinates);
}

watch(() => props.selectedPoint, () => {
  if (props.selectedPoint){
    LOCATION.value.center = props.selectedPoint;
    point.value.coordinates = props.selectedPoint;
  }
}, {immediate: true})

watch(map, (newMap, oldMap) => {
  if (newMap) {
    if (newMap.bounds !== oldMap?.bounds)
      point.value.coordinates = newMap.center as LngLat;
  }
});
</script>
<style scoped>

</style>