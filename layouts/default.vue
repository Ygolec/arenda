<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title><a href="/">
        <v-img src="public/logo-text.png" max-width="100"></v-img>
      </a></v-toolbar-title>

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

</style>