<template>
  <v-container>
    <v-row justify="center">
      <v-sheet>
        <v-card max-width="800">
          <v-item-group v-model="props.selected" mandatory>
            <v-container>
              <slot/>
            </v-container>
          </v-item-group>
        </v-card>
      </v-sheet>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
const props = defineProps({
  selected: Number,
})

</script>
<style scoped>

</style>