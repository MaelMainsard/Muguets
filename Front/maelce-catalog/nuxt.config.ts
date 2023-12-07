
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true
  },
  hooks: {
    'pages:extend' (pages) {
      pages.push(
        {
          name: 'home',
          path: '/',
          file: '/pages/Home.vue'
        },
        {
          name: 'cart',
          path: '/cart',
          file: '/pages/Cart.vue'
        }
      )
    }
  }
})
