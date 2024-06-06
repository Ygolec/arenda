<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title><a href="/hosting">My App</a></v-toolbar-title>
      <NuxtLink class="links" to="/hosting/listings">
        Объявления
      </NuxtLink>
      <NuxtLink class="links" to="/hosting/messages">
        Входящие
      </NuxtLink>
      <NuxtLink class="links" to="">
        Календарь
      </NuxtLink>
      <NuxtLink class="links" to="/hosting/reservations">
        Бронирования
      </NuxtLink>
      <v-spacer/>
      <user-avatar @exit="onLogout" @login="callAuth=true"/>
    </v-app-bar>
    <v-main>
      <slot></slot>
    </v-main>

  </v-app>
  <auth-dialog :dialog="callAuth" @close="callAuth=false"/>
</template>


<script setup lang="ts">
import AuthDialog from "~/components/authDialog.vue";
import type {Ref} from "vue";

const callAuth: Ref<boolean> = ref(false)
const {logout} = useDirectusAuth()


const onLogout = async () => {
  try {
    await logout()

  } catch (e) {
    console.log(e)
  }
};

</script>

<style scoped>
.links {
  font-size: 0.875rem !important;
  line-height: 1.125rem !important;
  font-weight: 600 !important;
  padding: 10px 16px !important;
  color: black;
  text-decoration: none;
  border-radius: 8px;
}
.links:hover {
  background-color: #f5f5f5;
  border-color: #f5f5f5;
  color: black;
}
</style>