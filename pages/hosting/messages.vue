<template>
  <v-main class="bg-grey-lighten-3">
    <v-container>
      <v-row>
        <v-col cols="3">
          <v-sheet rounded="lg">
            <v-list rounded="lg">
              <v-list-item
                  v-for="n in 5"
                  :key="n"
                  :title="`List Item ${n}`"
                  link
              ></v-list-item>

              <v-divider class="my-2"></v-divider>

              <v-list-item
                  color="grey-lighten-4"
                  title="Refresh"
                  link
              ></v-list-item>
            </v-list>
          </v-sheet>
        </v-col>

        <v-col>
          <v-sheet
              min-height="70vh"
              rounded="lg"
              class="d-flex flex-column"
          >
            <v-sheet class="flex-grow-1 overflow-auto" rounded="lg" max-height="500px">
              <v-row class="space-around d-flex flex-column">
                <v-card v-for="message in messages" :key="message.date_created" flat>
                  <v-list-item v-if="message.user_created !== user?.id" :key="message.date_created" class="received-message">
                    <template v-slot:prepend>
                      <v-avatar size="40">
                        <v-img src="https://via.placeholder.com/50"></v-img>
                      </v-avatar>
                    </template>
                    <div class="message-content">
                      <v-card class="flex-none" color="light">
                        <v-card-text class="pa-2">
                          <span class="text-subtitle-1">{{ message.content }}</span>
                          <span class="text-caption font-italic align-self-end">{{ message.date_created }}</span>
                        </v-card-text>
                      </v-card>
                    </div>
                  </v-list-item>
                  <v-list-item v-else :key="message.date_created" class="sent-message justify-end">
                    <div class="message-content">
                      <v-card class="flex-none" color="primary" dark>
                        <v-card-text class="pa-2">
                          <span class="text-subtitle-1">{{ message.content }}</span>
                          <span class="text-caption font-italic align-self-start">{{ message.date_created }}</span>
                        </v-card-text>
                      </v-card>
                    </div>
                    <template v-slot:prepend>
                      <v-avatar size="40">
                        <v-img src="https://via.placeholder.com/50"></v-img>
                      </v-avatar>
                    </template>
                  </v-list-item>
                </v-card>
              </v-row>
            </v-sheet>

            <v-sheet
                class="pa-3"
                elevation="1"
            >
              <v-sheet max-height="200">
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
    {{user}}
    {{messages}}
  </v-main>
</template>
<script setup lang="ts">
const message = ref();
const messages = ref<messages[]>([]);
const user = useDirectusUser();

const {getItems} = useDirectusItems();

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

onMounted(fetchMessages);
</script>
<style scoped>
.chat-message {
  display: unset !important;
  white-space: break-spaces;
}
.received-message .message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px;
}
.sent-message .message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 10px;
}
.received-message::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  left: 54px;
  right: auto;
  top: 12px;
  bottom: auto;
  border: 12px solid;
  border-color: #e0e0e0 transparent transparent transparent;
}
.sent-message::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: 54px;
  top: 12px;
  bottom: auto;
  border: 12px solid;
  border-color: #1976d2 transparent transparent transparent;
}
</style>