export default defineNuxtConfig({
  pages: true,
  components: true,
  compatibilityDate: '2024-11-01',
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxt/image'],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',
    },
  },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;1,200&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/aos@next/dist/aos.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
        },
      ],
      script: [
        {
          src: 'https://unpkg.com/aos@next/dist/aos.js',
        },
      ],
    },
  },
  css: ['@/assets/styles/global.css'], // Tambahkan path CSS di sini
});
