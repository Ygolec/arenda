<template>
  <v-stepper style="display: flex;flex-direction: column;" height="100%" v-model="stepper">

    <v-stepper-window>
      <v-stepper-window-item value="1">
      </v-stepper-window-item>
      <v-stepper-window-item value="2">321</v-stepper-window-item>
    </v-stepper-window>

    <v-stepper-actions
        class="mt-auto"
        :disabled="disabled"
        @click:next="next"
        @click:prev="prev"
        next-text="Начать"
        prev-text="Назад"
    >

    </v-stepper-actions>
  </v-stepper>
</template>
<script setup lang="ts">
const stepper = ref(0)
const step = ref(8)

function next() {
  stepper.value++
}

function prev() {
  stepper.value--
}

const disabled = computed(() => {
  return stepper.value === 0 ? 'prev' : stepper.value === step.value ? 'next' : undefined;
});
</script>
<style scoped>

</style>