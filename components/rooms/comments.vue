<template>
  {{ comments }}
  {{ overall_impression }}
  <v-container>
    <v-container class="pl-6">
      <div class="d-flex  flex-column my-auto">
        <v-row align="center" class="">
          <v-icon icon="star"></v-icon>
          <div class="text-h5">
            {{ average_rating }}
          </div>
          <v-icon icon="mdi:mdi-circle-small" size="30"></v-icon>
          <div class="text-h5">{{ comments.length }} Отзывов</div>
        </v-row>
      </div>
    </v-container>
    <v-row>
      <v-col>
        <v-card variant="text" min-width="230px">
          <v-card-title class="pb-0">Общая оценка</v-card-title>
          <v-card-item class="pt-0">
            <v-list
                bg-color="transparent"
                class="d-flex flex-column-reverse pt-0"
                density="compact"
            >
              <v-list-item class="pb-0 pt-0" style="min-height: 0" v-for="(rating,i) in overall_impression" :key="i">
                <v-progress-linear
                    :model-value="rating / comments.length * 100"
                    class="mx-n5"
                    color="black"
                    height="5"
                    rounded
                ></v-progress-linear>

                <template v-slot:prepend>
                  <span class="mr-2">{{ i }}</span>
                </template>

                <template v-slot:append>
                  <div class="rating-values">
                    <span class="d-flex justify-end"> {{ rating }} </span>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col class="d-flex flex-column">
        <v-card variant="text">
          <v-card-title>Чистота</v-card-title>
          <v-card-text>
            <span class="average_number">{{ average_cleanliness }}</span>
          </v-card-text>
        </v-card>
        <v-icon icon="mdi:mdi-spray-bottle" class="icon-of-rating" size="40"></v-icon>
      </v-col>
      <v-col class="d-flex flex-column">
        <v-card variant="text">
          <v-card-title>Точность</v-card-title>
          <v-card-text>
            <span class="average_number"> {{ average_accuracy }}</span>
          </v-card-text>
        </v-card>
        <v-icon icon="mdi:mdi-check-circle" class="icon-of-rating" size="40"></v-icon>
      </v-col>
      <v-col class="d-flex flex-column">
        <v-card variant="text">
          <v-card-title>Прибытие</v-card-title>
          <v-card-text>
            <span class="average_number">{{ average_arrival }}</span>
          </v-card-text>
        </v-card>
        <v-icon icon="mdi:mdi-door-open" class="icon-of-rating" size="40"></v-icon>
      </v-col>
      <v-col class="d-flex flex-column">
        <v-card variant="text">
          <v-card-title>Общение</v-card-title>
          <v-card-text>
            <span class="average_number">{{ average_communication }}</span>
          </v-card-text>
        </v-card>
        <v-icon icon="mdi:mdi-account-voice" class="icon-of-rating" size="40"></v-icon>
      </v-col>
      <v-col class="d-flex flex-column">
        <v-card variant="text">
          <v-card-title>Местоположение</v-card-title>
          <v-card-text>
            <span class="average_number">{{ average_communication }}</span>
          </v-card-text>
        </v-card>
        <v-icon icon="map" class="icon-of-rating" size="40"></v-icon>
      </v-col>
    </v-row>
    <v-divider class="mr-15 ml-15"></v-divider>
    <v-card variant="text">
      <v-card-item>
        <v-row>
          <v-col>
            <v-card
                v-for="(comment, index) in commentsLeft"
                variant="text"
                :key="index"
                class="mx-auto"
                subtitle="Откуда или сколько лет на сервисе"
            >
              <template v-slot:prepend>
                <v-avatar color="blue-darken-2">
                  <v-icon icon="mdi:mdi-alarm"></v-icon>
                </v-avatar>
              </template>
              <template v-slot:title>
                <span class="font-weight-black">{{ comment.user_created }}</span>
              </template>
              <v-card-item class="pb-0">
                <v-rating size="x-small" class="comment-rating" density="compact" v-model="comment.overall_impression"
                          readonly></v-rating>
                · дата посещения
              </v-card-item>
              <v-card-text>
                {{ comment.text }}
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card
                v-for="(comment, index) in commentsRight"
                variant="text"
                :key="index"
                class="mx-auto"
                subtitle="Откуда или сколько лет на сервисе"
            >
              <template v-slot:prepend>
                <v-avatar color="blue-darken-2">
                  <v-icon icon="mdi:mdi-alarm"></v-icon>
                </v-avatar>
              </template>
              <template v-slot:title>
                <span class="font-weight-black">{{ comment.user_created }}</span>
              </template>
              <v-card-item class="pb-0">
                <v-rating size="x-small" class="comment-rating" density="compact" v-model="comment.overall_impression"
                          readonly></v-rating>
                · дата посещения
              </v-card-item>
              <v-card-text>
                {{ comment.text }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">


const {getItems} = useDirectusItems();
const comments = ref<rental_comments[]>([]);
const route = useRoute()
const overall_impression = ref<Record<number, number>>({
  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 0
});
const average_communication = ref(0);
const average_cleanliness = ref(0);
const average_arrival = ref(0);
const average_accuracy = ref(0);
const average_location = ref(0);
const average_rating = ref(0);
const commentsLeft = computed(() => comments.value.filter((_, index) => index % 2 === 0).slice(0, 6));
const commentsRight = computed(() => comments.value.filter((_, index) => index % 2 !== 0).slice(0, 6));

const fetchComments = async () => {
  try {
    comments.value = await $fetch('/api/rental_comments/all-by-rental-id', {params: {rental_id: route.params.id}})
    // comments.value = await getItems<rental_comments>({
    //   collection: 'rental_comments',
    //   params: {
    //     filter: {
    //       rental_id: {
    //         "_eq": route.params.id
    //       }
    //     }
    //   }
    // });
    // console.log(comments.value)
  } catch (e) {
    console.error('Ошибка при получении галлереи фото:', e);
  }
};

fetchComments().then(
    () => {
      if (comments.value.length === 0) return;
      comments.value.forEach((comment) => {
        overall_impression.value[comment.overall_impression]++
      })
      let sum_communication = 0;
      let sum_cleanliness = 0;
      let sum_arrival = 0;
      let sum_accuracy = 0;
      let sum_location = 0;
      comments.value.forEach((comment) => {
        sum_communication += comment.communication;
        sum_cleanliness += comment.cleanliness;
        sum_arrival += comment.arrival;
        sum_accuracy += comment.accuracy;
        sum_location += comment.location;
      })
      average_communication.value = sum_communication / comments.value.length;
      average_cleanliness.value = sum_cleanliness / comments.value.length;
      average_arrival.value = sum_arrival / comments.value.length;
      average_accuracy.value = sum_accuracy / comments.value.length;
      average_location.value = sum_location / comments.value.length;
      average_rating.value = (average_communication.value + average_cleanliness.value + average_arrival.value + average_accuracy.value + average_location.value) / 5;


    }
)
</script>

<style scoped>
.average_number {
  line-height: 1.5rem;
  font-size: 1.125rem;
  color: black;
}

.icon-of-rating {
  margin-top: auto;
  margin-bottom: auto;
}

</style>