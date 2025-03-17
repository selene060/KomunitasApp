<template>
  <div  v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-4">
      <!-- Modal Header -->
      <div class="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-xl font-bold text-[#3845AD]">Create New Community</h2>
        <button 
          @click="closeModal" 
          class="text-gray-400 hover:text-[#3845AD] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-6">
            <!-- Category Dropdown -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <i class="fas fa-tag"></i>
                </span>
                <select 
                  v-model="form.category_id" 
                  class="w-full pl-12 pr-4 py-3 rounded-lg border border-[#F9CDCC] focus:outline-none focus:border-[#3845AD] focus:ring-1 focus:ring-[#3845AD]/20"
                  required
                >
                  <option value="">Select Category</option>
                  <option 
                    v-for="category in categories" 
                    :key="category.id" 
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <!-- Community Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Community Name</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <i class="fas fa-users-cog"></i>
                </span>
                <input 
                  v-model="form.name"
                  type="text"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-[#F9CDCC] focus:outline-none focus:border-[#3845AD] focus:ring-1 focus:ring-[#3845AD]/20"
                  placeholder="Enter community name"
                  required
                />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <i class="fas fa-file-signature"></i>
                </span>
                <textarea 
                  v-model="form.description"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-[#F9CDCC] focus:outline-none focus:border-[#3845AD] focus:ring-1 focus:ring-[#3845AD]/20"
                  placeholder="
Enter description"
                  rows="3"
                  required
                ></textarea>
              </div>
            </div>

            <!-- Community Photo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Community Photo</label>
              <div class="relative">
                <input 
                  ref="photoInput"
                  type="file" 
                  accept="image/*" 
                  @change="handlePhotoChange"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-[#F9CDCC] focus:outline-none focus:border-[#3845AD] focus:ring-1 focus:ring-[#3845AD]/20"
                />
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div class="grid grid-cols-2 gap-4">
                <label 
                  v-for="status in ['public', 'private']" 
                  :key="status"
                  class="relative cursor-pointer"
                >
                  <input 
                    type="radio" 
                    :value="status" 
                    v-model="form.status"
                    class="peer hidden" 
                  />
                  <div class="p-3 border border-[#F9CDCC] rounded-lg text-center peer-checked:border-[#3845AD] peer-checked:bg-[#3845AD]/5 hover:bg-gray-50 transition-all">
                    <i :class="[
                      'fas', 
                      status === 'public' ? 'fa-globe' : 'fa-lock', 
                      'text-gray-400 peer-checked:text-[#3845AD]'
                    ]"></i>
                    <div class="font-medium capitalize mt-1">{{ status }}</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <div class="grid grid-cols-2 gap-4">
                <label 
                  v-for="type in ['free', 'premium']" 
                  :key="type"
                  class="relative cursor-pointer"
                >
                  <input 
                    type="radio" 
                    :value="type" 
                    v-model="form.communities_type"
                    class="peer hidden" 
                  />
                  <div class="p-3 border border-[#F9CDCC] rounded-lg text-center peer-checked:border-[#3845AD] peer-checked:bg-[#3845AD]/5 hover:bg-gray-50 transition-all">
                    <i :class="[
                      'fas', 
                      type === 'premium' ? 'fa-crown' : 'fa-gift', 
                      'text-gray-400 peer-checked:text-[#3845AD]'
                    ]"></i>
                    <div class="font-medium capitalize mt-1">{{ type }}</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Subscription Price for Premium -->
            <div v-if="form.communities_type === 'premium'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Subscription Price</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <i class="fas fa-dollar-sign"></i>
                </span>
                <input 
                  v-model.number="form.subscription_price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-[#F9CDCC] focus:outline-none focus:border-[#3845AD] focus:ring-1 focus:ring-[#3845AD]/20"
                  placeholder="Enter subscription price"
                  required
                />
              </div>
            </div>

            <!-- Rules -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rules</label>
              <textarea 
                v-model="form.rules"
                class="w-full pl-4 pr-4 py-3 rounded-lg border border-[#F9CDCC] focus:outline-none focus:border-[#3845AD] focus:ring-1 focus:ring-[#3845AD]/20"
                placeholder="Enter community rules"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button 
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            :disabled="loading"
            class="px-6 py-2 bg-[#3845AD] text-white rounded-lg hover:bg-[#3845AD]/90 transition-colors"
          >
            {{ loading ? 'Creating...' : 'Create Community' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createCommunity } from '@/services/communityService'
import { fetchCategories } from '@/services/categoryService'
import { useToast } from 'vue-toastification'

// Definisikan interface untuk Category
interface Category {
  id: number;
  name: string;
}

// Props untuk mengontrol modal
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emit event untuk menutup modal
const emit = defineEmits(['close', 'submit'])

// Inisialisasi komponen
const toast = useToast()
const loading = ref(false)
const authStore = useAuthStore()
const token = authStore.accessToken
const photoInput = ref<HTMLInputElement | null>(null)

// State untuk kategori
const categories = ref<Category[]>([])

// Fungsi untuk mengambil kategori
onMounted(async () => {
  try {
    const response = await fetchCategories()
    categories.value = response.data
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
    toast.error('Gagal memuat kategori')
  }
})

// Form data
const form = ref({
  name: '',
  category_id: null as number | null,
  description: '',
  communities_type: 'free',
  status: 'public',
  rules: '',
  subscription_price: null as number | null,
  photo_community: null as File | null
})

// Handler untuk perubahan foto
const handlePhotoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    form.value.photo_community = target.files[0]
  }
}

// Reset form
const resetForm = () => {
  form.value = {
    name: '',
    category_id: null,
    description: '',
    communities_type: 'free',
    status: 'public',
    rules: '',
    subscription_price: null,
    photo_community: null
  }
  if (photoInput.value) {
    photoInput.value.value = ''
  }
}

// Submit form
const handleSubmit = async () => {
  if (!token) {
    toast.error('Anda harus login terlebih dahulu')
    return
  }

  try {
    loading.value = true

    // Buat FormData
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('category_id', form.value.category_id?.toString() || '')
    formData.append('description', form.value.description)
    formData.append('communities_type', form.value.communities_type)
    formData.append('status', form.value.status)
    if (form.value.rules) formData.append('rules', form.value.rules)
    if (form.value.subscription_price) formData.append('subscription_price', form.value.subscription_price.toString())
    if (form.value.photo_community) formData.append('photo_community', form.value.photo_community)

    // Kirim data ke backend
    const response = await createCommunity(formData, token)
    
    // Beri feedback
    toast.success('Komunitas berhasil dibuat')
    
    // Emit data submit dan tutup modal
    emit('submit', response.data)
    
    // Reset form
    resetForm()
  } catch (error) {
    console.error('Gagal membuat komunitas:', error)
    toast.error('Gagal membuat komunitas')
  } finally {
    loading.value = false
  }
}

// Tutup modal
const closeModal = () => {
  emit('close')
}
</script>