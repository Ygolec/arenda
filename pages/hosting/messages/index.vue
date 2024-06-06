<template>
  <v-main class="bg-grey-lighten-3">
    <v-container>
      <v-row>
        <v-col cols="3">
          <v-sheet rounded="lg">

            <v-list rounded="lg">
              <v-item-group v-model="selectedDialog" mandatory>
                <v-item
                    v-for="dialog in dialogs_of_messages"
                    :value="dialog.id"
                    v-slot="{ isSelected, toggle }">

                  <v-card
                      :style="isSelected ? 'background-color: #F7F7F7' : 'background-color: #FFFFFF'"
                      height="50"
                      dark
                      @click="toggle"
                  >

                    <v-scroll-y-transition>
                      <v-list-item
                          @click="redirectToDialog(dialog.id)"
                          :title="dialog.user_name"
                          :prepend-icon="dialog.avatar ? null: 'account_circle'"
                          :append-avatar="dialog.avatar ? '' : '' "

                      ></v-list-item>
                    </v-scroll-y-transition>

                  </v-card>

                </v-item>
              </v-item-group>
            </v-list>

          </v-sheet>
        </v-col>

        <v-col>
          <v-sheet
              min-height="70vh"
              rounded="lg"
              class="d-flex flex-column"
          >
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'hosting',
})
const selectedDialog = ref();
const dialogs_of_messages = ref<dialog_of_messages[]>([]);
const {token} = useDirectusToken();

const fetchDialogs = async () => {
  try {
    dialogs_of_messages.value = await $fetch('/api/dialog_of_messages/dialogs-of-user', {params: {token: token.value}})
  } catch (e) {
    console.error('Ошибка при получении диалогов:', e);
  } finally {
    if (dialogs_of_messages.value.length > 0) {
      navigateTo(`/hosting/messages/${dialogs_of_messages.value[0].id}`)
    }
  }
};


onMounted(async () => {
      await fetchDialogs();
    }
);
</script>
<style scoped>

</style>