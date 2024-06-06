<template>


  <v-navigation-drawer v-model="drawer" :width="widthInPx">
    {{ route.query }}
<v-text-field v-model="test"/>
  </v-navigation-drawer>
  <search-map @open-close_side-bar="drawer=!drawer"/>
</template>
<script setup lang="ts">
const route = useRoute()
const router = useRouter()
import {useWindowSize} from '@vueuse/core'

const drawer = ref<boolean>(true)
const {width} = useWindowSize()

const test = ref<string>('')
watch(test, (value) => {
  router.push({
    path: '/search',
    query: { test: ['awd','awd','awd','dwa','afw'] },
  })

})

const percentageWidth = ref<number>(50); // Задайте здесь ваш процент

const widthInPx = computed(() => {
  return (width.value / 100) * percentageWidth.value;
});


</script>
<style scoped>

</style>