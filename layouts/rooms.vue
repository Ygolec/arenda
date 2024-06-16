<template>
  <v-app id="inspire">
    <v-app-bar class="">
      <v-toolbar-title><a href="/hosting"><v-img src="public/logo-text.png" max-width="100"></v-img></a></v-toolbar-title>
      <v-spacer/>
      <user-avatar @exit="onLogout" @login="callAuth=true"/>
    </v-app-bar>
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>


          <v-col
              cols="8"
              offset="2"
          >
            <v-sheet
                min-height="80vh"
                rounded="lg"
            >
              <slot/>
            </v-sheet>
          </v-col>


        </v-row>
      </v-container>
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