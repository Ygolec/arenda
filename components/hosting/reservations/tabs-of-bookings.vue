<template>
  <v-card>
    <v-card-title>Бронирования</v-card-title>
    <v-tabs
        v-model="selectedTab"
        align-tabs="start"
        color="black"
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
        <upcoming/>
      </v-tabs-window-item>
      <v-tabs-window-item :value="3">
        <completed/>
      </v-tabs-window-item>
      <v-tabs-window-item :value="4">
        <canceled/>
      </v-tabs-window-item>
      <v-tabs-window-item :value="5">
        <all/>
      </v-tabs-window-item>

    </v-tabs-window>
  </v-card>
</template>
<script setup lang="ts">

import AwaitingApproval from "~/components/hosting/reservations/tabs/awaiting-approval.vue";
import Upcoming from "~/components/hosting/reservations/tabs/upcoming.vue";
import Canceled from "~/components/hosting/reservations/tabs/canceled.vue";
import All from "~/components/hosting/reservations/tabs/all.vue";
import Completed from "~/components/hosting/reservations/tabs/completed.vue";

const selectedTab = ref(1);
</script>
<style scoped>
.tab-name {
  font-size: 1rem !important;
  line-height: 1.25rem !important;
  font-weight: 300;
  color: #6A6A6A;
}
</style>