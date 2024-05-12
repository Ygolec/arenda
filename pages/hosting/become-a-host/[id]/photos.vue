<template>
  <v-stepper style="display: flex;flex-direction: column;" height="100%" v-model="stepper">
    <stepper-headers/>
    <v-stepper-window>
      <v-stepper-window-item value="7">
        <v-container>

          <v-row justify="center">
            <v-sheet>
              <v-card width="600px" max-width="800">
                <v-img v-for="(photo, index) in photos" :key="index" v-if="photos[1]" cover width="100%"
                       height="100%" :src="getThumbnail(photo.directus_files_id)"/>
                <v-btn @click="log()">123</v-btn>
                <v-file-input
                    v-model="filesLoading"
                    class="ma-2"
                    accept="image/*"
                    prepend-icon="mdi:mdi-camera"
                    label="Загрузка фотографий"
                    multiple
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

const {getItems} = useDirectusItems();
const {getItemById} = useDirectusItems();
const {getThumbnail} = useDirectusFiles();
const route = useRoute()
const ID_of_content = ref()
const stepper = ref(0)
const step = ref(8)
const filesLoading = ref()
const photos = ref<content_of_rental_files[]>([]);
const formData = new FormData()


async function log() {

  for (let i = 0; i < filesLoading.value.length; i++) {
    formData.append('photos', filesLoading.value[i])
  }
  await $fetch('/api/photo/upload_photo', {
    method: 'POST',
    body: formData,
    params: {rental_id: route.params.id}
  })
  formData.forEach(function (val, key, fD) {
    formData.delete(key)
  });
}

function next() {
  return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value + 1]}`)

}

function prev() {
  return navigateTo(`/hosting/become-a-host/${route.params.id}/${links_of_become_a_host[stepper.value - 1]}`)

}

const disabled = computed(() => {
  return stepper.value === 0 ? 'prev' : stepper.value === step.value ? 'next' : undefined;
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

const fetchPhotos = async () => {
  try {
    photos.value = await getItems<content_of_rental_files>({
      collection: 'content_of_rental_files',
      params: {
        filter: {
          content_of_rental_id: {
            "_eq": ID_of_content.value.content_id?.toString()
          }
        }
      }
    });
  } catch (e) {
    console.error('Ошибка при получении галлереи фото:', e);
  }
};

onMounted(async () => {
  stepper.value = 6
  await getIDofContent()
  await fetchPhotos()
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