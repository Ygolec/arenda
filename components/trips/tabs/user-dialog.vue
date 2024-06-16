<template>
  <div class="text-center">
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
        location="bottom"
    >
      <template v-slot:activator="{ props }">
        <v-btn
            variant="outlined"
            v-bind="props"
            rounded="lg"
            :readonly="!user"
            v-if="user"
        >
          {{ user.first_name + ' ' + user.last_name}}
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-card-text>
          Имя: {{ user.first_name }}
        </v-card-text>
        <v-card-text>
          Фамилия: {{ user.last_name }}
        </v-card-text>
        <v-card-text v-if="user.date_of_birth">
          Дата рождения: {{ user.date_of_birth }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
              variant="text"
              @click="menu = false"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script setup lang="ts">
import type {Ref} from "vue";

const menu: Ref<boolean> = ref(false)
const user=ref()
const props = defineProps({
  userID: String,
})

onMounted(async ()=>{
  user.value = await $fetch('/api/user/user-banner-info', {params: {user_id: props.userID}})
})
</script>
<style scoped>

</style>