<template>
  <v-stepper style="display: flex;flex-direction: column;" height="100%" v-model="stepper">
    <stepper-headers/>
    <v-stepper-window>
      <v-stepper-window-item value="2">
        <v-container>
          <v-row justify="center">
            <v-sheet>
              <v-card max-width="800">
                <v-item-group v-model="selectedValue" mandatory>
                  <v-container>
                    <v-row
                        v-for="type in types_of_booking"
                        :key="type.id">
                      <v-item :value="type.id" v-slot="{ isSelected, toggle }">
                        <v-card
                            min-width="240"
                            :color="isSelected ? '' : ''"
                            :variant="isSelected ? 'outlined' : 'text'"
                            class="d-flex align-center"
                            height="100"
                            dark
                            @click="toggle"
                        >
                          <v-scroll-y-transition>
                            <v-list lines="one">
                              <v-list-item
                                  :subtitle="type.description"
                                  width="655"
                              >
                                <template v-slot:title>
                                  <b> {{ type.name }}</b>
                                </template>
                                <template v-slot:append>
                                  <v-icon
                                      color="black"
                                      :icon="type.icon"
                                      size="45"
                                  />
                                </template>
                              </v-list-item>
                            </v-list>
                          </v-scroll-y-transition>
                        </v-card>
                      </v-item>
                    </v-row>
                  </v-container>
                </v-item-group>
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
const {getItems} = useDirectusItems();
const {getItemById} = useDirectusItems();
const {updateItem} = useDirectusItems();
const stepper = ref(0)
const step = ref(8)
const types_of_booking = ref<type_of_booking[]>([])
const selectedValue = ref()

async function next() {
  await updateType()
  return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value + 1]}`)

}

function prev() {
  return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value - 1]}`)
}

const disabled = computed(() => {
  if (stepper.value === 0) {
    if (selectedValue.value === undefined) {
      return true
    } else if (stepper.value === step.value) {
      return 'prev'
    } else {
      return 'next'
    }
  } else {
    if (selectedValue.value === undefined) {
      return 'next'
    } else if (stepper.value === step.value) {
      return 'next'
    }
  }
});

const fetchTypesOfBooking = async () => {
  try {
    types_of_booking.value = await getItems<type_of_booking>({
      collection: "type_of_booking",
    });
  } catch (e) {
  }
};

const fetchTypes = async () => {
  try {
    const response: any = await getItemById({
      collection: "rentals",
      id: route.params.id.toString(),
      params: {
        fields: ["type_booking_id"]
      }
    });
    if (response.type_booking_id !== null) {
      selectedValue.value = response.type_booking_id
    }
  } catch (e) {
  }
};

const updateType = async () => {
  try {
    await updateItem({
      collection: "rentals",
      id: route.params.id.toString(),
      item: {
        type_booking_id: selectedValue.value
      }
    });
  } catch (e) {
  }
}


onMounted(async () => {
  await fetchTypesOfBooking();
  await fetchTypes();
  stepper.value = 1
});

</script>
<style scoped>
.v-list-item__append > .v-icon {
  opacity: 1;
}
</style>