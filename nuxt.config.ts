// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    // Solo disponible en el servidor (endpoints de /server/api)
    n8nAdmisionWebhook: process.env.N8N_ADMISION_WEBHOOK || '',
    n8nAptitudWebhook: process.env.N8N_APTITUD_WEBHOOK || '',
    reniecApiUrl: process.env.RENIEC_API_URL || '',
    reniecApiToken: process.env.RENIEC_API_TOKEN || '',
  }
})
