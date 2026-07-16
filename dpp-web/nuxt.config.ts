// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  colorMode: {
    preference: 'light'
  },
  ui: {
    global: true,
    icons: ['heroicons']
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3011/api/v1'
    }
  },
  devServer: {
    port: 3010
  }
})
