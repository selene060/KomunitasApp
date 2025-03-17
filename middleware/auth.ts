// middleware/auth.ts
import { useAuthStore } from '~/stores/auth'

// Define valid route paths type
type RoutePath = '/superadmin/dashboard' | '/moderator/dashboard' | '/user/dashboard'

// Define the route map with proper typing
const roleRouteMap: Record<RoutePath, string[]> = {
  '/superadmin/dashboard': ['superadmin'],
  '/moderator/dashboard': ['moderator'],
  '/user/dashboard': ['user']
}

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // If not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Check if the current path is a protected route
  const path = to.path as RoutePath
  const allowedRoles = roleRouteMap[path]

  // If this is a protected route and user doesn't have permission
  if (allowedRoles && !authStore.checkAccess(allowedRoles)) {
    return navigateTo('/unauthorized')
  }
})