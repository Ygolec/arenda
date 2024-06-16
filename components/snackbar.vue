<template>
  <v-snackbar
      :model-value="props.snackbar"
      :timeout="props.timeout"
      :color="props.color"
      @update:model-value="emit('update:snackbar', false)"
  >
    {{ props.text }}
    <template v-slot:actions>
      <v-btn
          color="blue"
          variant="text"
          @click="emit('close')"
      >
        Закрыть
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script setup lang="ts">
const props = defineProps({
  snackbar: Boolean,
  text: String,
  timeout: String,
  color: String
})
const emit = defineEmits<{
  (e: 'close'): boolean
  (e: 'update:snackbar', value: boolean): boolean
}>()
</script>
<style scoped>

</style>