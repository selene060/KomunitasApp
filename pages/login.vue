<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F9CDCC]/20 to-[#3845AD]/10 flex items-center justify-center p-4 relative">
    <div class="w-full max-w-md z-10">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Your Art, Your Story! ✨</h1>
        <p class="text-gray-600">Let's get started!</p>
      </div>

      <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <i class="fas fa-envelope"></i>
              </span>
              <input 
                v-model="email"
                type="email"
                class="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#F9CDCC] focus:outline-none focus:border-[#3845AD] focus:ring-2 focus:ring-[#3845AD]/20 bg-white/5 transition-all duration-200"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div class="mb-6">
            <div class="flex justify-between mb-2">
              <label class="text-sm font-medium text-gray-700">Password</label>
            </div>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <i class="fas fa-lock"></i>
              </span>
              <input 
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full pl-12 pr-12 py-3.5 rounded-xl border border-[#F9CDCC] focus:outline-none focus:border-[#3845AD] focus:ring-2 focus:ring-[#3845AD]/20 bg-white/50 transition-all duration-200"
                placeholder="Enter password"
                required
              />
              <button 
                type="button"
                @click="togglePassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-6 py-3.5 bg-[#3845AD] text-white rounded-xl hover:bg-[#3845AD]/90 transition-all duration-200 font-medium shadow-lg shadow-[#3845AD]/20 hover:shadow-xl hover:shadow-[#3845AD]/30 disabled:opacity-50"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>

          <p v-if="errorMessage" class="text-red-500 text-center mt-4">
            {{ errorMessage }}
          </p>

          <p class="text-center mt-6 text-gray-600">
            Don't have an account? 
            <a href="#" class="text-[#3845AD] hover:underline font-medium">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>

// manggil layout
definePageMeta({
layout:'default'
})

// Composition API setup
const authStore = useAuthStore()
const router = useRouter()

// Reactive state
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Login handler
const handleSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const result = await authStore.login(email.value, password.value)

    if (result.error) {
      throw result.error
    }

    if (result.data) {
      localStorage.setItem('access_token', result.data.access)
      localStorage.setItem('refresh_token', result.data.refresh)
      localStorage.setItem('user', JSON.stringify(result.data.user))

      router.push('/dashboard')
    }
  } catch (error) {
    errorMessage.value = error.message || 'Login failed'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>