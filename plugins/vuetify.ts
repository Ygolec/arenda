// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'material-icons/iconfont/material-icons.css';
import { VDateInput } from 'vuetify/labs/VDateInput'

import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import {aliases, md} from 'vuetify/iconsets/md'
import {mdi} from 'vuetify/iconsets/mdi'
import {ru, en} from 'vuetify/locale'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        locale: {
            locale: 'ru',
            fallback: 'en',
            messages: {ru, en}
        },
        components:{
            VDateInput,
        },
        // ssr: true,
        icons: {
            defaultSet: 'md',
            aliases,
            sets: {
                md,
                mdi
            },
        },
        // ... your configuration
    })
    app.vueApp.use(vuetify)
})
