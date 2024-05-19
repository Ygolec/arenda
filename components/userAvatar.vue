<template>
  <v-menu
      class=""
      min-width="200px"
      rounded
  >
    <template v-slot:activator="{ props }">
      <v-btn
          icon
          v-bind="props"
      >
        <v-avatar
            color="info"
            size="large"
        >
          <v-icon icon="mdi:mdi-account-circle"></v-icon>
        </v-avatar>
      </v-btn>
    </template>
    <v-card v-if="user">
      <v-card-text>
        <div class="mx-auto text-center">
          <v-avatar
              color="brown"
          >
            <span class="text-h5">asd</span>
          </v-avatar>
          <h3>{{ user.first_name }}</h3>
          <p class="text-caption mt-1">
            {{ user.email }}
          </p>
          <v-divider class="my-3"></v-divider>
          <v-btn
              rounded
              variant="text"
              @click="emit('edit')"
              href="/profile"
          >
            Редактировать профиль
          </v-btn>
          <v-divider class="my-3"></v-divider>
          <v-btn
              rounded
              variant="text"
              href="/hosting/listings"
          >
            Список сдаваемого жилья
          </v-btn>
          <v-divider class="my-3"></v-divider>
          <v-btn
              rounded
              variant="text"
              @click="emit('exit')"
          >
            Выйти
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
    <v-card v-if="!user">
      <v-card-text>
        <div class="mx-auto text-center">
          <v-btn
              rounded
              variant="text"
              @click="emit('login')"
          >
            Войти
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">



const emit = defineEmits<{
  (e: 'exit'): void
  (e: 'edit'): void
  (e: 'login'): boolean
}>()



const user = ref(useDirectusUser())




</script>

<style scoped lang="scss">

</style>