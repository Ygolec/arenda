<template>
  <v-stepper style="display: flex;flex-direction: column;" height="100%" v-model="stepper">
    <stepper-headers/>
    <v-stepper-window>
      <v-stepper-window-item value="1">
        <v-container>
          <v-row justify="center">
            <v-sheet>
              <v-card max-width="800">
                <v-item-group v-model="selectedValue" mandatory>
                  <v-row>
                    <v-col
                        v-for="type in types_of_rental"
                        :key="type.id"
                        cols="12"
                        md="6"
                    >
                      <v-item :value="type.id" v-slot="{ isSelected, toggle }">
                        <v-card
                            min-width="240"
                            :color="isSelected ? '' : ''"
                            :variant=" 'outlined' "
                            :style="isSelected ? 'border: black 2px solid;background-color: #F7F7F7' : 'border: #DDDDDD 1px solid;background-color: #FFFFFF'"
                            class="d-flex align-center"
                            height="100"
                            dark
                            @click="toggle"
                        >
                          <v-scroll-y-transition>
                            <div
                                class="text-h4 flex-grow-1 text-center"
                            >
                              <v-icon :icon="type.icon"></v-icon>
                              <br>
                              {{ type.name }}
                            </div>
                          </v-scroll-y-transition>
                        </v-card>
                      </v-item>
                    </v-col>
                  </v-row>
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
const step = ref(0)
const types_of_rental = ref<type_of_rental[]>([]);
const selectedValue = ref()

async function next() {
  await updateType()
  return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value + 1]}`)
}

function prev() {
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
      return 'prev'
    } else {
      return 'next'
    }
  }
})

const fetchTypesOfRental = async () => {
  try {
    types_of_rental.value = await getItems<type_of_rental>({
      collection: "type_of_rental",
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
        fields: ["type_id"]
      }
    });
    if (response.type_id !== null) {
      selectedValue.value = response.type_id
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
        type_id: selectedValue.value
      }
    });
  } catch (e) {
  }
}


onMounted(async () => {
  await fetchTypesOfRental();
  await fetchTypes();
  stepper.value = 0
});
</script>
<style scoped>

</style>