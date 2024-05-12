<template>
  <div>
    <v-app>
      <!--      <NuxtWelcome />-->

      {{ user }}
      <main-map-yandex/>
    </v-app>
  </div>
</template>
<script setup lang="ts">
const user = useDirectusUsers();


</script>