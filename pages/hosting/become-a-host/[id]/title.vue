<template>
  <v-stepper style="display: flex;flex-direction: column;" height="100%" v-model="stepper">
    <stepper-headers/>
    <v-stepper-window>
      <v-stepper-window-item value="8">
        <v-container>
          <v-row justify="center">
            <v-sheet>
              <v-card width="600px" max-width="800">
                <v-textarea
                    variant="outlined"
                    v-model="title"
                    maxlength="32"
                    single-line
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
const ID_of_content = ref()
const {getItemById} = useDirectusItems();
const {updateItem} = useDirectusItems();
const title = ref()

async function next() {
  await updateTitle()
  return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value + 1]}`)

}

function prev() {
  return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value - 1]}`)

}

const disabled = computed(() => {
  if (stepper.value === 0) {
    if (title.value === undefined) {
      return true
    } else if (stepper.value === step.value) {
      return 'prev'
    } else {
      return 'next'
    }
  } else {
    if (title.value === undefined) {
      return 'next'
    } else if (stepper.value === step.value) {
      return 'next'
    }
  }
});

const getIDofContent = async () => {
  ID_of_content.value = await getItemById({
    collection: "rentals",
    id: route.params.id.toString(),
    params: {
      fields: ["content_id"]
    }
  });
}

const fetchTitle = async () => {
  try {
    const response: any = await getItemById({
      collection: "content_of_rental",
      id: ID_of_content.value.content_id.toString(),
      params: {
        fields: ["title"]
      }
    });
    if (response.title !== null) {
      title.value = response.title
    }
  } catch (e) {
  }
};

const updateTitle = async () => {
  try {
    await updateItem({
      collection: "content_of_rental",
      id: ID_of_content.value.content_id.toString(),
      item: {
        title: title.value
      }
    });
  } catch (e) {
  }
}


onMounted(async () => {
  stepper.value = 7
  await getIDofContent()
  await fetchTitle()
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