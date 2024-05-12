<template>
  <div
      class="marker"
  >
    <v-chip
        @click="check = !check"
        variant="elevated"
        color="#ffffff"

    >
      <span class="price_rental_text" v-if="rental">{{ rental.price }} ₽</span>
    </v-chip>

    <div
        v-if="check"
        class="popup"
    >
      <v-card
          link
          min-width="300"
          v-click-outside="onClickOutside"
      >
        <v-carousel
            :continuous="false"
            height="200"
            show-arrows="hover"
            hide-delimiter-background
        >
          <template v-slot:prev="{ props }">
            <v-btn
                size="small"
                icon="mdi:mdi-chevron-left"
                @click="props.onClick"
            ></v-btn>
          </template>
          <template v-slot:next="{ props }">
            <v-btn

                size="small"
                icon="mdi:mdi-chevron-right"
                @click="props.onClick"
            ></v-btn>
          </template>
          <v-carousel-item
              :href="123"
              v-for="photo in photos"
              :src="getThumbnail(photo.directus_files_id)"
              cover
          >
            <v-sheet height="100%">
              <a :href="'/rooms/'+rental_id" style="text-decoration:none;color: black">
                <v-img
                    :src="getThumbnail(photo.directus_files_id)"
                    cover
                    height="100%"
                    width="100%"/>
              </a>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
        <a :href="'/rooms/'+rental_id" style="text-decoration:none;color: black">
          <v-card-text>
            <v-row align="center" no-gutters>
              <v-col
                  cols="6"
              >
                <b>{{ rental_location?.city }}</b>
              </v-col>

              <v-col v-if="average_rating" class="text-right" cols="6">
                <v-icon class="mb-1 mr-1" icon="mdi:mdi-star"></v-icon>
                {{ average_rating }}
              </v-col>
            </v-row>

            <b>{{ rental?.price }}₽ </b>ночь<br>
          </v-card-text>
        </a>
      </v-card>

    </div>
  </div>
</template>

<script setup lang="ts">


const check = ref(false)
const {getItemById} = useDirectusItems();
const {getItems} = useDirectusItems();
const {getThumbnail} = useDirectusFiles();


const props = defineProps({
  rental_id: Number,
})

const rental = ref<rental>();
const rental_location = ref<location>();
const photos = ref<content_of_rental_files[]>([]);
const average_rating = ref();


const fetchRentals = async () => {
  try {
    rental.value=await $fetch('/api/rentals/one-by-id', {params: {rental_id: props.rental_id}})
    // rental.value = await getItemById({
    //   collection: 'rentals',
    //   id: props.rental_id?.toString()
    // });
  } catch (e) {
    console.error('Ошибка при получении аренды:', e);
  }
};

const fetchLocation = async () => {
  try {
    rental_location.value=await $fetch('/api/location/one-by-id', {params: {location_id: rental.value?.location_id}})
    // rental_location.value = await getItemById({
    //   collection: 'location',
    //   id: rental.value?.location_id?.toString()
    // });
  } catch (e) {
    console.error('Ошибка при получении локации:', e);

  }
};

const fetchPhotos = async () => {
  try {
    photos.value = await getItems<content_of_rental_files>({
      collection: 'content_of_rental_files',
      params: {
        filter: {
          content_of_rental_id: {
            _eq: rental.value?.content_id
          }
        }
      }
    });
  } catch (e) {
    console.error('Ошибка при получении галлереи фото:', e);
  }
};

function onClickOutside() {
  check.value = false;
}


onMounted(async () => {
  await fetchRentals()
  await fetchLocation()
  await fetchPhotos()
  average_rating.value = await $fetch('/api/rooms/average_rating', {params: {rental_id: props.rental_id}})
})


</script>

<style scoped>

.marker {

  display: flex;
  align-items: center;
  justify-content: center;
  /*  border-radius: 10px;
    cursor: pointer;
    color: #fff;
    padding: 10px 20px;
    white-space: nowrap;*/
}

.price_rental_text {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.25rem;
}

.popup {
  position: absolute;
  top: calc(100% + 10px);
  /*  background: #fff;
    border-radius: 10px;
    padding: 10px;
    color: black;*/
}

</style>