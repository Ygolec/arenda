<template>
  <v-stepper style="display: flex;flex-direction: column;" height="100%" v-model="stepper">
    <stepper-headers/>
    <v-stepper-window>
      <v-stepper-window-item value="5">
        <v-container>
          <v-row justify="center">
            <v-sheet>
              <v-card width="600px" max-width="800">
                <v-row class="align-center ma-1">
                  <v-col cols="8">
                    Гости
                  </v-col>
                  <v-col>
                    <v-btn
                        icon="mdi:mdi-minus"
                        @click="decrementMaxOfGuest"
                        :disabled="content.number_of_max_guests <= 1"
                    />
                    <span class="number_of_attribute">{{ content.number_of_max_guests }}</span>
                    <v-btn
                        icon="mdi:mdi-plus"
                        @click="incrementMaxOfGuest"
                        :disabled="content.number_of_max_guests >= 16"
                    />
                  </v-col>
                </v-row>
                <v-divider/>
                <v-row class="align-center ma-1">
                  <v-col cols="8">
                    Спальни
                  </v-col>
                  <v-col>
                    <v-btn
                        icon="mdi:mdi-minus"
                        @click="decrementBedrooms"
                        :disabled="content.number_of_bedrooms <= 0"
                    />
                    <span class="number_of_attribute">{{ content.number_of_bedrooms }}</span>
                    <v-btn
                        icon="mdi:mdi-plus"
                        @click="incrementBedrooms"
                        :disabled="content.number_of_bedrooms >= 50"
                    />
                  </v-col>
                </v-row>
                <v-divider/>
                <v-row class="align-center ma-1">
                  <v-col cols="8">
                    Кровати
                  </v-col>
                  <v-col>
                    <v-btn
                        icon="mdi:mdi-minus"
                        @click="decrementBeds"
                        :disabled="content.number_of_beds <= 1"

                    />
                    <span class="number_of_attribute">{{ content.number_of_beds }}</span>
                    <v-btn
                        icon="mdi:mdi-plus"
                        @click="incrementBeds"
                        :disabled="content.number_of_beds >=50"

                    />
                  </v-col>
                </v-row>
                <v-divider/>
                <v-row class="align-center ma-1">
                  <v-col cols="8">
                    Ванные
                  </v-col>
                  <v-col>
                    <v-btn
                        icon="mdi:mdi-minus"
                        @click="decrementBathrooms"
                        :disabled="content.number_of_bathrooms <= 1"
                    />
                    <span class="number_of_attribute">{{ content.number_of_bathrooms }}</span>
                    <v-btn
                        icon="mdi:mdi-plus"
                        @click="incrementBathrooms"
                        :disabled="content.number_of_bathrooms >=50"
                    />
                  </v-col>
                </v-row>
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

const {getItemById} = useDirectusItems();
const {updateItem} = useDirectusItems();
const stepper = ref(0)
const step = ref(8)
const ID_of_content = ref()
const content = ref<content_of_rental>({
  number_of_max_guests: 4,
  number_of_bedrooms: 1,
  number_of_beds: 1,
  number_of_bathrooms: 1
})
const route = useRoute()


async function next() {
  await updateContentOfFloorPlan()
  return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value + 1]}`)
}

function prev() {
  return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value - 2]}`)

}

const disabled = computed(() => {
  return stepper.value === 0 ? 'prev' : stepper.value === step.value ? 'next' : undefined;
});


const decrementMaxOfGuest = () => {
  if (content.value.number_of_max_guests > 1) {
    content.value.number_of_max_guests--;
  }
}

const incrementMaxOfGuest = () => {
  if (content.value.number_of_max_guests <= 16)
    content.value.number_of_max_guests++;
}

const decrementBedrooms = () => {
  if (content.value.number_of_bedrooms > 0) {
    content.value.number_of_bedrooms--;
  }
}

const incrementBedrooms = () => {
  if (content.value.number_of_bedrooms <= 50)
    content.value.number_of_bedrooms++;
}

const decrementBeds = () => {
  if (content.value.number_of_beds > 1) {
    content.value.number_of_beds--;
  }
}
const incrementBeds = () => {
  if (content.value.number_of_beds <= 50)
    content.value.number_of_beds++;
}

const decrementBathrooms = () => {
  if (content.value.number_of_bathrooms > 1) {
    content.value.number_of_bathrooms--;
  }
}
const incrementBathrooms = () => {
  if (content.value.number_of_bathrooms <= 50)
    content.value.number_of_bathrooms++;
}

const getIDofContent = async () => {
  ID_of_content.value = await getItemById({
    collection: "rentals",
    id: route.params.id.toString(),
    params: {
      fields: ["content_id"]
    }
  });
}


const fetchContentOfFloorPlan = async () => {
  try {
    const response: any = await getItemById<content_of_rental>({
      collection: "content_of_rental",
      id: ID_of_content.value.content_id.toString(),
      params: {
        fields: ["number_of_max_guests", "number_of_bedrooms", "number_of_beds", "number_of_bathrooms"]
      }
    });

    if (response.number_of_max_guests !== null && response.number_of_bedrooms !== null && response.number_of_beds !== null && response.number_of_bathrooms !== null) {
      content.value = response
    }
  } catch (e) {
  }
};

const updateContentOfFloorPlan = async () => {
  try {
    await updateItem({
      collection: "content_of_rental",
      id: ID_of_content.value.content_id.toString(),
      item: {
        number_of_max_guests: content.value.number_of_max_guests,
        number_of_bedrooms: content.value.number_of_bedrooms,
        number_of_beds: content.value.number_of_beds,
        number_of_bathrooms: content.value.number_of_bathrooms
      }
    });
  } catch (e) {
  }
}

onMounted(async () => {
  await getIDofContent()
  await fetchContentOfFloorPlan()
  stepper.value = 4
});
</script>
<style scoped>
.number_of_attribute {
  margin-left: 10px;
  margin-right: 10px;
  font-weight: 600;
}
</style>