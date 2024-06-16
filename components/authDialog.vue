<template>
  <v-dialog
      v-model="props.dialog"
      max-width="400"
  >
    <v-card max-width="400">
      <v-window v-model="stepOfAuth">
        <v-window-item :value="1">
          <v-toolbar>
            <v-btn
                icon="mdi:mdi-close"
                @click="emit('close')"
            ></v-btn>
            <v-toolbar-title>Войдите или зарегистрируйтесь</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field
                label="Email"
                type="email"
                v-model="email"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn block
                   variant="tonal"
                   class="ms-auto"
                   text="Продолжить"
                   @click="checkExistEmail"
            ></v-btn>
          </v-card-actions>
        </v-window-item>

        <v-window-item :value="2">
          <v-toolbar>
            <v-btn
                icon="mdi:mdi-arrow-left"
                @click="stepOfAuth=1"
            ></v-btn>
            <v-toolbar-title>Войдите</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field
                label="Email"
                type="email"
                v-model="email"
            />
            <v-text-field
                label="Пароль"
                type="password"
                v-model="password"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn block
                   variant="tonal"
                   class="ms-auto"
                   text="Войти"
                   @click="onSubmit"
            ></v-btn>
          </v-card-actions>
        </v-window-item>

        <v-window-item :value="3">
          <v-toolbar>
            <v-btn
                icon="mdi:mdi-arrow-left"
                @click="stepOfAuth=1"
            ></v-btn>
            <v-toolbar-title>Завершите регистрацию</v-toolbar-title>
          </v-toolbar>
          <v-form ref="registration_form" @submit.prevent="validate_registration_form">
            <v-card-text>
              <v-text-field
                  :rules="[required]"
                  label="Имя"
                  v-model="first_name"
              />
              <v-text-field
                  :rules="[required]"
                  label="Фамилия"
                  v-model="last_name"
              />
              <v-date-input
                  :rules="[required]"
                  type="text"
                  label="Дата рождения"
                  v-model="date_of_birthday"
                  prepend-icon=""
                  max-width="368"
              />
              <v-text-field
                  :rules="[required]"
                  label="Email"
                  type="email"
                  v-model="email"
              />
              <v-text-field
                  :rules="[required]"
                  label="Пароль"
                  type="password"
                  v-model="password"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn block
                     type="submit"
                     variant="tonal"
                     class="ms-auto"
                     text="Зарегистрироваться"
              ></v-btn>
            </v-card-actions>
          </v-form>
        </v-window-item>

        <v-window-item :value="4">
          <v-toolbar>
            <v-btn
                icon="mdi:mdi-arrow-left"
                @click="stepOfAuth=3"
            ></v-btn>
            <v-toolbar-title>Спасибо за регистрацию!</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="text-lg-body-1">
            Подвердите свой email письмом на почте и войдите в систему!
          </v-card-text>
          <v-card-actions>
            <v-btn block
                   variant="tonal"
                   class="ms-auto"
                   text="Завершить"
                   @click="emit('close')"
            ></v-btn>
          </v-card-actions>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
  <snackbar
      :snackbar="isSnackBar"
      text="Пользователь с таким email уже существует"
      timeout="5000"
      color="error"
      @close="isSnackBar = false"
      @update:snackbar="isSnackBar = $event"
  />
</template>
<script setup lang="ts">

import type {Ref} from "vue";
import {required} from "~/utils/rules";


const props = defineProps({
  dialog: Boolean,
})

const {login} = useDirectusAuth()


const user = useDirectusUser();

const email: Ref<string> = ref("")
const password: Ref<string> = ref("")
const first_name: Ref<string> = ref("")
const last_name: Ref<string> = ref("")
// const date_of_birthday: Ref<string> = ref("")
const registration_form = ref(null)
const date_of_birthday = ref()
const existEmail: Ref<boolean> = ref(false);
const stepOfAuth: Ref<number> = ref(1)
const isSnackBar: Ref<boolean> = ref(false);


async function checkExistEmail() {
  existEmail.value = await $fetch('/api/user/exist', {params: {email: email.value}})
  if (existEmail.value)
    stepOfAuth.value = 2
  else stepOfAuth.value = 3
}

const emit = defineEmits<{
  (e: 'close'): boolean
  (e: 'confirm'): void
}>()

const onSubmit = async () => {
  try {
    await login({email: email.value, password: password.value})
    emit('close');
  } catch (e) {
    console.log(e)
  }
}

const register = async () => {
  try {
    await $fetch('/api/user/register', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        first_name: first_name.value,
        last_name: last_name.value,
        date_of_birthday: new Date(date_of_birthday.value).toLocaleDateString()
      })
    })
    // emit('close');
  } catch (e) {
    console.log(e)
    if (e.status === 400) {
      isSnackBar.value = true
    }
  } finally {
    if (!isSnackBar.value) {
      stepOfAuth.value = 4
    }
  }
}

async function validate_registration_form() {
  const {valid} = await registration_form.value.validate()
  if (valid) await register()
}

</script>
<style scoped>

</style>