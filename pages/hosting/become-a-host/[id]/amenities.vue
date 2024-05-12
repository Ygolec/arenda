<template>
  <v-stepper style="display: flex;flex-direction: column;" height="100%" v-model="stepper">
    <stepper-headers/>
    <v-stepper-window>
      <v-stepper-window-item value="6">
        <v-container>
          <v-row justify="center">
            <v-sheet>
              <v-card width="600px" max-width="800">
                <v-item-group v-model="selectedValue" multiple>
                  <v-row>
                    <v-col
                        v-for="(convenience, index) in conveniences_of_rentals"
                        :key="convenience.id"
                        cols="4"
                    >
                      <v-item v-slot="{ isSelected, toggle }">
                        <v-card
                            height="120px"
                            :color="isSelected ? '' : ''"
                            :variant=" 'outlined' "
                            :style="isSelected ? 'border: black 2px solid;background-color: #F7F7F7' : 'border: #DDDDDD 1px solid;background-color: #FFFFFF'"
                            @click="toggle"
                        >
                          <v-icon class="icon-amenities" :icon="convenience.icon" size="50"/>
                          <br>
                          <v-card-item><span class="name-amenities">{{ convenience.name }}</span></v-card-item>

                        </v-card>
                      </v-item>

                      <!-- Начинаем новый ряд каждые три элемента -->
                      <v-row v-if="(index + 1) % 3 === 0"></v-row>

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

const {getItems} = useDirectusItems();
const {getItemById} = useDirectusItems();
const {updateItem} = useDirectusItems();

const stepper = ref(0)
const step = ref(8)

const conveniences_of_rentals = ref<conveniences_of_rentals[]>([]);
const selectedValue = ref([])
const route = useRoute()

async function next() {
  await updateConveniencesOfRentals()
  return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value + 1]}`)
}

function prev() {
  return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value - 1]}`)
}

const disabled = computed(() => {
  if (stepper.value === 0) {
    if (selectedValue.value.length === 0) {
      return true
    } else if (stepper.value === step.value) {
      return 'prev'
    } else {
      return 'next'
    }
  } else {
    if (selectedValue.value.length === 0) {
      return 'next'
    } else if (stepper.value === step.value) {
      return 'next'
    }
  }
});

const fetchConveniencesOfRentals = async () => {
  try {
    conveniences_of_rentals.value = await getItems<type_of_rental>({
      collection: "conveniences_of_rentals",
    });
  } catch (e) {
  }
};


const fetchSelectedConveniencesOfRentals = async () => {
  try {
    const response: any = await getItemById<content_of_rental>({
      collection: "rentals",
      id: route.params.id.toString(),
      params: {
        fields: ["conveniences_ids"]
      }
    });
    if (response.conveniences_ids !== null) {
      selectedValue.value = response.conveniences_ids
    }
  } catch (e) {
  }
};

const updateConveniencesOfRentals = async () => {
  try {
    await updateItem({
      collection: "rentals",
      id: route.params.id.toString(),
      item: {
        conveniences_ids: selectedValue.value,
      }
    });
  } catch (e) {
  }
}


onMounted(async () => {
  stepper.value = 5
  await fetchConveniencesOfRentals();
  await fetchSelectedConveniencesOfRentals()
});
</script>
<style scoped>
.icon-amenities {
  margin-top: 10px;
  margin-left: 10px;
}

.name-amenities {
  font-weight: 600;
}
</style>