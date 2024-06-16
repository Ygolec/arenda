<template>
  <v-card>
    <v-card-title>Мои бронирования</v-card-title>
    <div class="d-flex flex-row">
    <v-tabs
        v-model="selectedTab"
        align-tabs="start"
        color="black"
        direction="vertical"
    >
      <v-tab class="tab-name" :value="1">Ждут одобрения</v-tab>
      <v-tab class="tab-name" :value="2">Предстоящие</v-tab>
      <v-tab class="tab-name" :value="3">Завершенные</v-tab>
      <v-tab class="tab-name" :value="4">Отменены</v-tab>
      <v-tab class="tab-name" :value="5">Все</v-tab>
    </v-tabs>

    <v-tabs-window v-model="selectedTab">
      <v-tabs-window-item :value="1">
        <awaiting-approval/>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">

      </v-tabs-window-item>
      <v-tabs-window-item :value="3">

      </v-tabs-window-item>
      <v-tabs-window-item :value="4">

      </v-tabs-window-item>
      <v-tabs-window-item :value="5">

      </v-tabs-window-item>

    </v-tabs-window>
    </div>
  </v-card>
</template>
<script setup lang="ts">

import AwaitingApproval from "~/components/trips/tabs/awaiting-approval.vue";

const selectedTab = ref(1);

</script>
<style scoped>

</style>