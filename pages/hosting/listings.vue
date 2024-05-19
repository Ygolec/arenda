<template>
  <v-app-bar :elevation="0" :style="{ zIndex: 1004, transition: 'none !important' }">
    <template v-slot:append>
      <v-btn icon="mdi:mdi-heart"></v-btn>

      <v-btn icon="mdi:mdi-magnify"></v-btn>

      <v-btn icon="mdi:mdi-plus" href="/hosting/become-a-host"></v-btn>
    </template>
  </v-app-bar>
  <v-container>

    <v-row>
      <v-col cols="3" v-for="(rental, index) in rentals" v-if="rentals" :key="index">
        <dialog-edit
            :key="index"
            @close="closeDialog(rental.id)"
            @update:dialog="value => dialogs[rental.id] = value"
            :rental="rental"
            :photo="uniquePhotos[rental.content_id]"
            :dialog="dialogs[rental.id]"
        />
        <v-card
            @click="openDialog(rental.id)"
        >
          <v-chip class="status" v-if="statuses[index]">
            {{ statuses[index].name_translate }}
          </v-chip>
          <v-img :src="getThumbnail(uniquePhotos[rental.content_id])"/>
          {{ rental }}
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import DialogEdit from "~/components/hosting/listings/dialog-edit.vue";
import type {ComputedRef} from "vue";

definePageMeta({
  middleware: ["account-settings"]
})


const {getItems} = useDirectusItems();
const rentals = ref<rental[]>([]);
const photos = ref<content_of_rental_files[]>([]);
const statuses = ref<status[]>([]);
const {getThumbnail} = useDirectusFiles();
const dialogs = ref<Record<number, boolean>>({});
const uniquePhotos: ComputedRef<Record<number, string>> = computed(() => {
  return photos.value.reduce((acc: Record<number, string>, photo) => {
    if (!acc[photo.content_of_rental_id]) {
      acc[photo.content_of_rental_id] = photo.directus_files_id;
    }
    return acc;
  }, {});
});

const openDialog = (id: number) => {
  dialogs.value[id] = true;
};

const closeDialog = (id: number) => {
  dialogs.value[id] = false;
};

const fetchRentals = async () => {
  try {
    rentals.value = await getItems<rental>({
      collection: "rentals",
    });
    rentals.value.forEach(rental => {
      dialogs.value[rental.id] = false;
      uniquePhotos.value[rental.content_id] = '';
    });
  } catch (e) {
  } finally {
    if (rentals.value.length > 0) {
      await fetchPhotos();
      await fetchStatus();
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


onMounted(() => {
  fetchRentals();
});
</script>
<style scoped>
.status {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  background-color: white;
  color: black;
  font-weight: 600;
}
</style>