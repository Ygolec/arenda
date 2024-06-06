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
            <v-sheet
                max-height="65vh"
                class="flex-grow-1 overflow-auto"
                rounded="lg">
              <v-col cols="10" :offset="user?.id==message.user_created ? 2 : 0" v-for="message in messages">
                <v-card v-if="user?.id!=message.user_created" :key="message.date_created" variant="text">
                  <v-card-subtitle>{{ message.date_created + ' || ' + message.date_created }}</v-card-subtitle>
                  <v-card-item>
                    <v-row>
                      <v-col cols="1">
                        <v-container>
                          <v-avatar>
                            <v-icon size="50" icon="account_circle"></v-icon>
                          </v-avatar>
                        </v-container>
                      </v-col>
                      <v-col cols="11" class="align-content-center">
                        <div class="other-message"> {{ message.content }}</div>
                      </v-col>
                    </v-row>
                  </v-card-item>
                </v-card>
                <v-card v-if="user?.id==message.user_created" :key="message.date_created" variant="text">
                  <v-card-subtitle class="my-message-time">{{ message.date_created }}</v-card-subtitle>
                  <v-card-item>
                    <div class="my-message"> {{ message.content }}</div>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-sheet>

            <v-sheet
                class="pa-3"
                elevation="1"
            >
              <v-sheet>
                <v-row align="center">
                  <!--                <v-col cols="1">-->
                  <!--                  <v-icon icon="mdi:mdi-image" size="24"></v-icon>-->
                  <!--                </v-col>-->
                  <v-col cols="11">
                    <v-textarea
                        v-model="message"
                        label="Enter your message"
                        rows="1"
                        auto-grow
                        outlined
                        class="mt-0"
                        max-rows="7"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="1">
                    <v-btn @click="sendMessage()" icon="mdi:mdi-send">
                    </v-btn>
                  </v-col>

                </v-row>
              </v-sheet>
            </v-sheet>


          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    {{ selectedDialog }}
  </v-main>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'hosting',
})
import {socket} from "~/components/socket";

const route = useRoute()
const message = ref();
const selectedDialog = ref(route.params.id);
const messages = ref<messages[]>([]);
const dialogs_of_messages = ref<dialog_of_messages[]>([]);
const user = useDirectusUser();


const {token} = useDirectusToken();

const {getItems} = useDirectusItems();

function redirectToDialog(id: number) {
  console.log(id)
  if (selectedDialog.value === id) return;
  return navigateTo(`/hosting/messages/${id}`)

}


const fetchMessages = async () => {
  try {
    messages.value = await getItems<messages>({
      collection: 'messages',
      // params: {
      //   filter: {
      //     dialog_of_messages_id: {
      //       _eq: 3
      //     }
      //   }
      // }
    });
  } catch (e) {
    console.error('Ошибка при получении сообщений:', e);
  } finally {

  }
};

const fetchDialogs = async () => {
  try {
    dialogs_of_messages.value = await $fetch('/api/dialog_of_messages/dialogs-of-user', {params: {token: token.value}})
  } catch (e) {
    console.error('Ошибка при получении диалогов:', e);
  } finally {
  }
};

async function sendMessage() {
  try {
    await $fetch('/api/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user.value?.id,
        message: message.value,
        dialog_of_messages_id: 1
      })
    });
    message.value = '';
    await fetchMessages();
  } catch (e) {
    console.error('Ошибка при отправке сообщения:', e);
  } finally {
    await fetchMessages()
  }

}

socket.on("updateChat", (value) => {
  fetchMessages();
});

onMounted(async () => {
      await fetchMessages();
      await fetchDialogs();
    }
);
</script>
<style scoped>
.other-message {
  color: #222222;
  padding: 16px;
  border-radius: 12px;
  border-bottom-left-radius: 2px;
  background-color: #F7F7F7;
}

.my-message {
  color: #FFFFFF;
  padding: 16px;
  border-radius: 12px;
  border-bottom-right-radius: 2px;
  background-color: #3f3f3f;
}

.my-message-time {
  text-align: end;
}
</style>