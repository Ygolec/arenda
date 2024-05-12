<template>
  <v-container>
    <VDatePickerVCalendar v-model.range.string="range_booking" :masks="masks" :min-date="new Date()" :columns="columns"
                          borderless/>
  </v-container>

</template>

<script setup lang="ts">
import {useScreens} from "vue-screen-utils";


const {mapCurrent} = useScreens({xs: '0px', sm: '640px', md: '768px', lg: '1024px'});
const columns = mapCurrent({lg: 2}, 2);


const masks = ref({
  modelValue: 'DD-MM-YYYY',
});


const range_booking = useState<booking_range>('range_booking', () => ({start: '', end: ''}))


</script>

<style scoped>

</style>