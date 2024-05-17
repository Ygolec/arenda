// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify'

export default defineNuxtConfig({
    build: {
        transpile: ['vuetify'],
    },
    devtools: {enabled: true},
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
    modules: [
        // 'nuxt-security',
        'vue-yandex-maps/nuxt',
        // 'nuxt-directus-next',
        'nuxt-directus',
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({autoImport: true}))
            })
        },
    ],
    yandexMaps: {
        apikey: 'e1a6fad9-632c-4ed2-9f20-dd0cc990c444',
    },
    directus: {
        // autoFetch: true,
        autoRefresh: true,
        url: "http://localhost:8055/",
    },


    // security:{
    //     corsHandler:{
    //         allowHeaders:"*",
    //         origin:"*"
    //     }
    // }

})
