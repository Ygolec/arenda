<template>
  <v-menu
      transition="slide-y-transition"
      :close-on-content-click="false"
      location="bottom"
  >
    <template v-slot:activator="{ props }">
      <v-select
          menu-icon=""
          v-model="selected_tenant"
          label="Кто поедет?"
          density="compact"
          variant="plain"
          rounded="xl"
          readonly
          hide-details
          v-bind="props"
      >
      </v-select>
    </template>

    <v-card class="mt-2" min-width="400" variant="elevated">
      <v-card-item>
        <v-row class="align-center ma-1">
          <v-col>
            Взрослые
          </v-col>
          <v-col>
            <v-btn
                icon="mdi:mdi-minus"
                @click="emit('decrementAdults')"
            />
            {{ tenant_information.adults }}
            <v-btn
                icon="mdi:mdi-plus"
                @click="emit('incrementAdults')"
            />
          </v-col>
        </v-row>
        <v-row class="align-center ma-1">
          <v-col>
            Дети
          </v-col>
          <v-col>
            <v-btn
                icon="mdi:mdi-minus"
                @click="emit('decrementChildren')"
            />
            {{ tenant_information.children }}
            <v-btn
                icon="mdi:mdi-plus"
                @click="emit('incrementChildren')"
            />
          </v-col>
        </v-row>
        <v-row class="align-center ma-1">
          <v-col>
            Питомцы
          </v-col>
          <v-col>
            <v-btn
                icon="mdi:mdi-minus"
                @click="emit('decrementPets')"
            />
            {{ tenant_information.pets }}
            <v-btn
                icon="mdi:mdi-plus"
                @click="emit('incrementPets')"
            />
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">

const props = defineProps<{
  tenant_information: tenant_information,
}>()

const emit = defineEmits<{
  (e: 'decrementAdults'): void
  (e: 'incrementAdults'): void
  (e: 'decrementChildren'): void
  (e: 'incrementChildren'): void
  (e: 'decrementPets'): void
  (e: 'incrementPets'): void
}>()

const selected_tenant = computed(() => {
  const totalGuests = props.tenant_information.adults + props.tenant_information.children;
  const totalPets = props.tenant_information.pets;
  let result = `${totalGuests} гост${totalGuests > 1 ? 'ей' : 'ь'}`;
  if (totalPets > 0) {
    result += `, ${totalPets} питомец${totalPets > 1 ? 'ев' : ''}`;
  }
  return result;
});
</script>
<style scoped>

</style>