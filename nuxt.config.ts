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
        '~/assets/fonts/fonts.css',
        '~/assets/scss/colors.scss',
    ],

    modules: [
        '@nuxtjs/eslint-module',
        '@sidebase/nuxt-session',
        '@nuxtjs/style-resources',
    ],
    styleResources: {
        scss: ['./assets/scss/*.scss']
    },
    eslint: {
        fix: true,
    }
})
