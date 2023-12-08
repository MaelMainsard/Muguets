
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
          name: 'login',
          path: '/login',
          file: '/pages/Login.vue'
        },
        {
          name:'register',
          path: '/register',
          file: '/pages/Register.vue'
        },
        {
          name: '/reset_password',
          path: '/reset_password',
          file: '/pages/Reset.vue'
        }
      )
    }
  }
})
