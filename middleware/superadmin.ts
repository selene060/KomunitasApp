// middleware/superadmin.ts
export default defineNuxtRouteMiddleware(() => {
    const authStore = useAuthStore()
    
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      return navigateTo('/login')
    }
    
    // Check if user is superadmin
    if (authStore.userRole !== 'superadmin') {
      return navigateTo('/unauthorized')
    }
  })