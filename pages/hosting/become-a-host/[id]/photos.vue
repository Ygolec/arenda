<template>
  <v-stepper style="display: flex;flex-direction: column;" height="100%" v-model="stepper">
    <stepper-headers/>
    <v-stepper-window>
      <v-stepper-window-item value="7">
        <v-container>
          <v-row justify="center">
            <v-sheet>
              <v-card width="600px" max-width="800">
                {{ filePhotos }}
                <v-carousel v-if="filePhotos[0]">
                  <v-carousel-item v-for="(photo, index) in filePhotos" :key="index">
                    <v-sheet height="100%">
                      <v-img :src="getThumbnail(photo.id)" cover width="100%" height="100%">
                        <v-chip variant="elevated" class="main_photo" v-if="photo.tags && photo.tags.includes('main')">Фото обложки</v-chip>
                        <v-menu
                        >
                          <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon="more_vert" class="more_button"></v-btn>
                          </template>
                          <v-list density="compact">
                            <v-list-item @click="makePhotoMain(photo)" link v-if="photo.tags && !photo.tags.includes('main')">
                              <v-list-item-title>Сделать фото основным</v-list-item-title>
                            </v-list-item>
                            <v-list-item link>
                              <v-list-item-title>Удалить</v-list-item-title>
                            </v-list-item>
<!--                            <v-btn v-if="!photo.tags" variant="text" block>Сделать фото основным</v-btn>-->
<!--                            <v-btn variant="text" block>Удалить</v-btn>-->
                          </v-list>
                        </v-menu>


                      </v-img>
                    </v-sheet>
                  </v-carousel-item>
                </v-carousel>
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
const {getFiles} = useDirectusFiles();

const route = useRoute()
const ID_of_content = ref()
const stepper = ref(0)
const step = ref(8)
const filesLoading = ref()
const photos = ref<content_of_rental_files[]>([]);
const filePhotos = ref<directus_files[]>([]);
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

async function makePhotoMain(photo: directus_files) {
  try {
    await $fetch('/api/photo/make-main', {
      method: 'POST',
      params: {photo_id: photo.id, content_id: ID_of_content.value.content_id}
    })
  } catch (e) {
    console.error('Ошибка при обновлении фото:', e);
  } finally {
    await fetchPhotos()
  }

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
  } finally {
    await fetchPhotosFile()
  }
};

const fetchPhotosFile = async () => {
  try {
    filePhotos.value = await getFiles({
      params: {
        fields: ['id', 'tags'],
        filter: {
          id: {
            "_in": photos.value.map(photo => photo.directus_files_id)
          }
        }
      }
    })

  } catch (e) {
    console.error('Ошибка при получении галлереи фото:', e);
  } finally {
    if (filePhotos.value.length > 0) {
      filePhotos.value.sort((a, b) => {
        if (a.tags && a.tags.includes('main') && (!b.tags || !b.tags.includes('main'))) {
          return -1;
        }
        if ((!a.tags || !a.tags.includes('main')) && b.tags && b.tags.includes('main')) {
          return 1;
        }
        return 0;
      });
    }
  }
};

onMounted(async () => {
  stepper.value = 6
  await getIDofContent()
  await fetchPhotos()
});
</script>
<style scoped>
.more_button {
  position: absolute;
  right: 10px;
  top: 10px;
}

.main_photo {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  background-color: white;
  color: black;
  font-weight: 600;
}

.icon-amenities {
  margin-top: 10px;
  margin-left: 10px;
}

.name-amenities {
  font-weight: 600;
}
</style>