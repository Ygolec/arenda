// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'
import { mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
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
