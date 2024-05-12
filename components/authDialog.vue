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
          <v-card-text>
            <v-text-field
                label="Имя"

            />
            <v-text-field
                label="Фамилия"

            />
            <v-text-field
                label="Дата рождения"

            />
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
      </v-window>


    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">

import type {Ref} from "vue";



const props = defineProps({
  dialog: Boolean,
})

const {login} = useDirectusAuth()


const user = useDirectusUser();

const email: Ref<string> = ref("")
const password: Ref<string> = ref("")
const existEmail: Ref<boolean> = ref(false);
const stepOfAuth: Ref<number> = ref(1)


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

// function register() {
//   const {createUser} = useDirectusAuth();
//   const router = useRouter();
//   const onSubmit = async () => {
//     try {
//       const newUser = await createUser({email: "", password: ""});
//     } catch (e) {
//     }
//   };
// }


const onSubmit = async () => {
  try {
    await login({email: email.value, password: password.value})
    emit('close');
  } catch (e) {
    console.log(e)
  }
}

</script>
<style scoped>

</style>