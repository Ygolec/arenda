<template>
  <v-dialog
      v-model="props.dialog"
      max-width="50rem"
      persistent
  >
    <v-card>
      <v-card-title>Вы точно хотите отменить бронирование {{ props.booking_id }}?</v-card-title>
      <v-card-text>Прежде чем отменить бронирование, пожайлуста выберите причину отмены.</v-card-text>
      <v-form ref="form" fast-fail @submit.prevent="validate">
        <v-card-item>
          <v-container>

            <v-select
                :rules="[required]"
                variant="outlined"
                v-model="reason"
                :items="reasons"
                label="Причина отмены"
                outlined
                clearable
                hide-no-data
            />
          </v-container>
        </v-card-item>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="emit('close')">
            Закрыть
          </v-btn>

          <v-btn type="submit">
            Отменить бронирование
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {required} from "~/utils/rules";

const props = defineProps({
  dialog: Boolean,
  booking_id: Number,
})
const reason = ref('')
const reasons = [
  'Жилье не будет готово в срок бронирования',
  'Экстренная ситуация',
  'Сомнение в подлинности гостя',
]

const form = ref(null)

async function validate() {
  const {valid} = await form.value.validate()
  if (valid) emit('cancelBooking', props.booking_id, reason.value)
}

const emit = defineEmits<{
  (e: 'close'): boolean
  (event: 'cancelBooking', booking_id?: number, reason?: string): boolean
}>()
</script>
<style scoped>

</style>