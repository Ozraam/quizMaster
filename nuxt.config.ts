// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {
        enabled: true,

        timeline: {
            enabled: true
        }
    },

    css: [
        '~/assets/scss/global.scss',
        '~/assets/fonts/fonts.css'
    ],

    modules: [
        '@nuxtjs/eslint-module',
        '@sidebase/nuxt-session'
    ],
    eslint: {
        fix: true,
    }
})
