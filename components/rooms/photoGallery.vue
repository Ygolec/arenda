<template>
  <v-skeleton-loader
      :loading="loading"
      height="300"
      type="image"
  >
    <v-container>
      <v-row>
        <v-col cols="12" lg="6">
          <v-sheet height="435">
            <v-img v-for="(photo, index) in photos.slice(0, 1)" :key="index" v-if="photos[1]" cover width="100%"
                   height="100%" :src="getThumbnail(photo.directus_files_id)"/>
          </v-sheet>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row>
            <v-col v-for="(photo, index) in photos.slice(1, 3)" :key="index" cols="24" md="6">
              <v-sheet height="206">
                <v-img v-if="photo" cover width="100%" height="100%" :src="getThumbnail(photo.directus_files_id)"/>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-for="(photo, index) in photos.slice(3, 5)" :key="index" cols="24" md="6">
              <v-sheet height="206">
                <v-img v-if="photo" cover width="100%" height="100%" :src="getThumbnail(photo.directus_files_id)"/>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-skeleton-loader>
</template>
<script setup lang="ts">


const props = defineProps({
  content_id: Number,
})


const {getThumbnail} = useDirectusFiles();
const {getItems} = useDirectusItems();
const photos = ref<content_of_rental_files[]>([]);
const loading = ref(true);

const fetchPhotos = async () => {
  try {
    photos.value = await getItems<content_of_rental_files>({
      collection: 'content_of_rental_files',
      params: {
        filter: {
          content_of_rental_id: {
            _eq: props.content_id?.toString()
          }
        }
      }
    });
    if (photos.value.length > 0) {
      loading.value = false;
    }
  } catch (e) {
    console.error('Ошибка при получении галлереи фото:', e);
  }
};

watch(() => props.content_id, () => {
  if (props.content_id)
    fetchPhotos()
}, {immediate: true})

// onMounted(async () => {
//   await fetchPhotos()
// })
</script>
<style scoped>

</style>