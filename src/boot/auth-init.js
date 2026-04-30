import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/auth'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router }) => {
  // Initialiser l'AuthStore depuis localStorage au démarrage de l'application
  const authStore = useAuthStore()
  authStore.initializeFromStorage()
  
  // Rediriger vers la page de connexion si pas d'access_token et pas sur les pages publiques
  router.beforeEach((to, from, next) => {
    const publicPages = ['/acceuil', '/login', '/register', '/forgot-password', '/reset-password']
    const authRequired = !publicPages.includes(to.path)
    
    if (authRequired && !authStore.access_token) {
      return next('/acceuil')
    }
    
    next()
  })
})