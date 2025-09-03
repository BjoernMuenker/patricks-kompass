export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  components: { global: false },
  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'de',
      },
      meta: [
        { charset: 'utf-8' },
        {
          hid: 'viewport',
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: `Patricks Kompass`,
        },
        {
          hid: 'application-name',
          name: 'application-name',
          content: `Patricks Kompass`,
        },
        {
          hid: 'msapplication-TileColor',
          name: 'msapplication-TileColor',
          content: '#fff',
        },
        {
          hid: 'description',
          name: 'description',
          content: `Eine digitale Karte voller Erinnerungen und Empfehlungen deiner Freunde.`,
        },
        { hid: 'og:title', property: 'og:title', content: `Happy Birthday!` },
        {
          hid: 'og:description',
          property: 'og:description',
          content: `Eine digitale Karte voller Erinnerungen und Empfehlungen deiner Freunde.`,
        },
        { hid: 'og:image', property: 'og:image', content: 'https://www.patricks-kompass.de/meta/open-graph-image.png' },
        { hid: 'og:image:width', property: 'og:image:width', content: '1200' },
        { hid: 'og:image:height', property: 'og:image:height', content: '630' },
        { hid: 'twitter:title', name: 'twitter:title', content: 'https://www.patricks-kompass.de/meta/twitter-image.png' },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: ``,
        },
        { hid: 'twitter:image', name: 'twitter:image', content: '' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/meta/favicon.ico',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/meta/favicon-16x16.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/meta/favicon-32x32.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          sizes: '180x180',
          href: '/meta/apple-touch-icon.png',
        },
      ],
      title: 'Patricks Kompass',
    },
  },
  vite: {
    resolve: {
      alias: {
        '@googlemaps/js-api-loader': '@googlemaps/js-api-loader/dist/index.mjs',
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: '@use "sass:map"; @use "sass:math"; @import "@/assets/scss/global-inject.scss";',
          silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
        },
      },
    },
  },
  css: ['@/assets/scss/global-once.scss'],
  runtimeConfig: {
    public: {
      GOOGLE_API_KEY: process.env.NUXT_PUBLIC_GOOGLE_API_KEY,
    },
  },
});
