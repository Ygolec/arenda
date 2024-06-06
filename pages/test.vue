

<template xmlns="http://www.w3.org/1999/html">


</template>
<script setup lang="ts">
// const user = useDirectusUser();

const {getItems} = useDirectusItems();

const locate = ref<location[]>([]);
const tets=ref()

const fetchCoordinate = async () => {
  try {
    locate.value = await getItems<location>({
      collection: 'location',
    });
  } catch (e) {
    console.error('Ошибка при получении координат:', e);
  }
};
const { token } = useDirectusToken();


const fetchtest = async () => {
  try {
    tets.value = await $fetch('/api/test/test1',{params:{token:token.value}})
    console.log(tets.value)
  } catch (e) {
    console.error('Ошибка при получении координат:', e);
  }
};

onMounted(() => {
  fetchtest();
});
</script>
<style scoped>

</style>