<template>
  <v-stepper style="display: flex;flex-direction: column;" height="100%" v-model="stepper">
    <stepper-headers/>
    <v-stepper-window>
      <v-stepper-window-item value="9">
        <v-container>
          <v-row justify="center">
            <v-sheet>
              <v-card width="600px" max-width="800">
                <v-textarea
                    variant="outlined"
                    v-model="description"
                    maxlength="500"
                    counter
                />
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
</template>

<script setup lang="ts">

import StepperHeaders from "~/components/hosting/become-a-host/stepper-headers.vue";


const route = useRoute()
const stepper = ref(0)
const step = ref(8)

const description = ref()

function next() {
  return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value+1]}`)
}

function prev() {
  return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value-1]}`)
}

const disabled = computed(() => {
  return stepper.value === 0 ? 'prev' : stepper.value === step.value ? 'next' : undefined;
});


onMounted(async () => {
  stepper.value = 8
});
</script>
<style scoped>

</style>