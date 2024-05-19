<template>
  <v-dialog
      :model-value="props.dialog"
      width="auto"
      @update:model-value="$emit('update:dialog', $event)"

  >
    <v-card
        width="400"
    >
      <v-toolbar color="white">
        <v-btn
            icon="mdi:mdi-close"
            @click="emit('close');"
        ></v-btn>
      </v-toolbar>
      <v-img class="ma-auto" width="200" cover :src="getThumbnail(props.photo)"/>
      <v-card-item>
        <v-btn
            :href="'/hosting/become-a-host/'+props.rental.id"
            class="text-none mb-4"
            color="black"
            variant="flat"
            block
        >
          Редактировать объявление
        </v-btn>

        <v-btn
            class="text-none mb-4"
            color="white"
            variant="flat"
            block
        >
          Удалить объявление
        </v-btn>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
const props = defineProps<{
  dialog: boolean,
  rental: rental,
  photo: string
}>()

const emit = defineEmits<{
  (e: 'close'): boolean
  (e: 'update:dialog', value: boolean): boolean
}>()

const {getThumbnail} = useDirectusFiles();


</script>
<style scoped>

</style>