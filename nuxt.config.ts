// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  devServer: {
    port: 3000
  },
  nitro: {
    prerender: {
      failOnError: false,
      crawlLinks: true
    }
  }
})
