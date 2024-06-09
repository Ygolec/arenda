<template>
  <v-row>
    <v-col cols="4" v-if="rentals" v-for="rental in rentals">
      <v-card
          link
          class="mr-2 ml-2"
          :key="rental.id"
      >
        <v-carousel
            model-value="0"
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
              v-for="photo in photos.filter((item) => item.content_of_rental_id == rental.content_id)"
              :src="getThumbnail(photo.directus_files_id)"
              cover

          >
            <v-sheet height="100%">
              <a :href="'/rooms/'+rental.id" style="text-decoration:none;color: black">
                <v-img
                    :src="getThumbnail(photo.directus_files_id)"
                    cover
                    height="100%"
                    width="100%"/>
              </a>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
        <a :href="'/rooms/'+rental.id" style="text-decoration:none;color: black">
          <v-card-text>
            <v-row align="center" no-gutters>
              <v-col
                  cols="6"
              >
                <b v-if="rental_location && rental_location.find((item) => item.rentals_id[0] === rental.id)">
                  {{ rental_location.find((item) => item.rentals_id[0] === rental.id).city }}
                </b>
              </v-col>

              <!--              <v-col v-if="getAvarageRating(rental.id)" class="text-right" cols="6">-->
              <!--                <v-icon class="mb-1 mr-1" icon="mdi:mdi-star"></v-icon>-->
              <!--                {{ getAvarageRating(rental.id) }}-->
              <!--              </v-col>-->
            </v-row>

            <b>{{ rental?.price }}₽ </b>ночь<br>
          </v-card-text>
        </a>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type {PropType} from "vue";

const {getItems} = useDirectusItems();
const {getThumbnail} = useDirectusFiles();

const props = defineProps({
  rentals_coordinates: Array as PropType<rentals_coordinates[]>,
})

const rentals = ref<rental[]>();
const rental_location = ref<location[]>();
const photos = ref<content_of_rental_files[]>([]);

const fetchRentals = async () => {
  try {
    rentals.value = await $fetch('/api/search/get-all-rentals-by-ids', {
      body: props.rentals_coordinates?.map((rentals_coordinate) => rentals_coordinate.rental_id),
      method: 'POST'
    })

  } catch (e) {
    console.error('Ошибка при получении аренды:', e);
  }
};

const fetchLocation = async () => {
  try {
    rental_location.value = await $fetch('/api/search/get-all-locations-by-ids', {
      body: rentals.value.map((rental) => rental.location_id),
      method: 'POST'
    })
    // console.log(rental_location.value)
  } catch (e) {
    console.error('Ошибка при получении локации:', e);

  }
};

const fetchPhotos = async () => {
  try {
    photos.value = await $fetch('/api/photo/get-photos-by-content-id', {
      body: rentals.value.map((rental) => rental.content_id),
      method: 'POST'
    })

    // photos.value = await getItems<content_of_rental_files>({
    //   collection: 'content_of_rental_files',
    //   params: {
    //     filter: {
    //       content_of_rental_id: {
    //         _in: rentals.value?.content_id
    //       }
    //     }
    //   }
    // });
    // console.log(photos.value)
  } catch (e) {
    console.error('Ошибка при получении галлереи фото:', e);
  }
};

watch(
    () => props.rentals_coordinates,
    async () => {
      if (props.rentals_coordinates?.length > 0) {
        fetchRentals().then(() => {
          fetchLocation().then(() => {
            fetchPhotos()
          })
        });
      } else {
        rentals.value = []
        rental_location.value = []
        photos.value = []
      }

    }, {immediate: true}
)


function getAvarageRating(rental_id: number) {
  // console.log($fetch('/api/rooms/average_rating', {params: {rental_id: rental_id}}))
  return $fetch('/api/rooms/average_rating', {params: {rental_id: rental_id}})
}


</script>
<style scoped>

</style>