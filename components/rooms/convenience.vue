<template>
  <v-card
      variant="flat">
    <v-card-title>
      Какие удобства вас ждут
    </v-card-title>
    <v-card-text>
      <v-list style="column-count: 2" lines="one" height="250px">
        <v-list-item
            v-for="(convenience, index) in conveniences"
            :key="index"
            :title="convenience.name"
        >
          <template v-slot:prepend>
            <v-icon :icon="convenience.icon" size="30"></v-icon>
          </template>
        </v-list-item>
      </v-list>

    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">


const props = defineProps({
  conveniences_ids: {
    type: Array,
    required: true
  },
})

const conveniences = ref<conveniences_of_rentals[]>([]);
const {getItems} = useDirectusItems();

const fetchConveniences = async () => {
  try {
    console.log(props.conveniences_ids)
    conveniences.value = await $fetch('/api/conveniences/range-by-id', {body: props.conveniences_ids, method: 'POST'})
    console.log(conveniences.value)

    // conveniences.value = await getItems<conveniences_of_rentals>({
    //   collection: 'conveniences_of_rentals',
    //   params: {
    //     filter: {
    //       'id': {
    //         "_in": props.conveniences_ids
    //       }
    //     }
    //   }
    // });
  } catch (e) {
    console.error('Ошибка при получении удобств:', e);
  }
};

watch(() => props.conveniences_ids, () => {
  if (props.conveniences_ids)
    fetchConveniences()
}, {immediate: true})
</script>

<style scoped>

</style>