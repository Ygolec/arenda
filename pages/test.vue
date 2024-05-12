

<template xmlns="http://www.w3.org/1999/html">
{{user}}<br>
  {{locate}}
</template>
<script setup lang="ts">
const user = useDirectusUser();

const {getItems} = useDirectusItems();

const locate = ref<location[]>([]);

const fetchCoordinate = async () => {
  try {
    locate.value = await getItems<location>({
      collection: 'location',
    });
  } catch (e) {
    console.error('Ошибка при получении координат:', e);
  }
};

onMounted(async () => {
  await fetchCoordinate();
})
</script>
<style scoped>

</style>