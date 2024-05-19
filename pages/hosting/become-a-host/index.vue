<template>
  <v-container>
    {{ rentals }}
    {{ contents }}
    <v-btn href="/hosting">Выйти</v-btn>
    <v-row justify="center">
      <v-sheet class="pa-2 ma-2">
        <v-card width="600px" max-width="800">
          <span>Завершить объявление</span>
          <v-btn :href="'/hosting/become-a-host/'+rental.id" width="600" height="70" v-for="(rental, index) in rentals"
                 :key="index" class="mb-5">
            <template v-slot:prepend>
              <v-img width="50" height="50" :src="getThumbnail(uniquePhotos[rental.content_id])"/>
            </template>
            {{ contents[index].title }}
          </v-btn>
          <v-divider class="my-3" :thickness="2"></v-divider>
          <span>Новое объявление</span>
          <v-btn style="justify-content: left" width="600" height="70">
            <template v-slot:prepend>
              <v-icon icon="add_home" size="40"/>
            </template>
            Создать объявление
          </v-btn>
        </v-card>
      </v-sheet>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import type {ComputedRef} from "vue";



const {getItems} = useDirectusItems();
const rentals = ref<rental[]>([]);
const contents = ref<content_of_rental[]>([]);
const photos = ref<content_of_rental_files[]>([]);
const statuses = ref<status[]>([]);
const {getThumbnail} = useDirectusFiles();
const uniquePhotos: ComputedRef<Record<number, string>> = computed(() => {
  return photos.value.reduce((acc: Record<number, string>, photo) => {
    if (!acc[photo.content_of_rental_id]) {
      acc[photo.content_of_rental_id] = photo.directus_files_id;
    }
    return acc;
  }, {});
});
const fetchRentals = async () => {
  try {
    rentals.value = await getItems<rental>({
      collection: "rentals",
    });
    rentals.value.forEach(rental => {
      uniquePhotos.value[rental.content_id] = '';
    });
    console.log(rentals.value)
  } catch (e) {
  } finally {
    if (rentals.value.length > 0) {
      await fetchPhotos();
      await fetchStatus();
      await fetchContent();
    }
  }
};

const fetchStatus = async () => {
  try {
    statuses.value = await getItems<status>({
      collection: "rentals_status",
      params: {
        filter: {
          id: {
            "_in": rentals.value.map(rental => rental.status)
          }
        }
      }
    });
  } catch (e) {
    console.error('Ошибка при получении статусов:', e);
  }
}


const fetchPhotos = async () => {
  try {
    photos.value = await getItems<content_of_rental_files>({
      collection: 'content_of_rental_files',
      params: {
        filter: {
          content_of_rental_id: {
            "_in": rentals.value.map(rental => rental.content_id)
          }
        }
      }
    });
  } catch (e) {
    console.error('Ошибка при получении галлереи фото:', e);
  }
};

const fetchContent = async () => {
  try {
    contents.value = await getItems<content_of_rental>({
      collection: 'content_of_rental',
      params: {
        filter: {
          id: {
            "_in": rentals.value.map(rental => rental.content_id)
          }
        }
      }
    });
  } catch (e) {
    console.error('Ошибка при контента жилья:', e);
  }
};

onMounted(() => {
  fetchRentals();
});
</script>
<style scoped>

</style>