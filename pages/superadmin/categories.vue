<!-- pages/superadmin/categories.vue -->
<template>
    <div class="min-h-screen bg-gray-100 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Category Management</h1>
          <p class="mt-2 text-gray-600">Manage your website categories</p>
        </div>
  
        <!-- Add Category Form -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Add New Category</h2>
          <form @submit.prevent="createCategory" class="flex gap-4">
            <input
              v-model="newCategoryName"
              placeholder="Category Name"
              required
              class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="submit"
              class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Category
            </button>
          </form>
        </div>
  
        <!-- Categories List -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Categories</h2>
            <div class="divide-y divide-gray-200">
              <div v-for="category in categories" :key="category.id" 
                   class="py-4 flex items-center justify-between">
                <div class="flex-1">
                  <span v-if="editingCategory?.id !== category.id" 
                        class="text-gray-900">
                    {{ category.name }}
                  </span>
                  <input
                    v-else
                    v-model="editingCategory.name"
                    class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div class="flex gap-2">
                  <button
                    v-if="editingCategory?.id === category.id"
                    @click="updateCategory"
                    class="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    v-else
                    @click="editCategory(category)"
                    class="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(category.id)"
                    class="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useCategoryStore } from '~/stores/category'
  import { useAuthStore } from '~/stores/auth'
  import { storeToRefs } from 'pinia'
  
  
  
  const authStore = useAuthStore()
  const categoryStore = useCategoryStore()
  const { categories } = storeToRefs(categoryStore)
  
  const newCategoryName = ref('')
  const editingCategory = ref(null)
  
  // Check superadmin access on component mount
  onMounted(() => {
  
    categoryStore.fetchCategories()
  })
  
  const createCategory = () => {
    if (newCategoryName.value) {
      categoryStore.createCategory(newCategoryName.value)
      newCategoryName.value = ''
    }
  }
  
  const editCategory = (category) => {
    editingCategory.value = { ...category }
  }
  
  const updateCategory = () => {
    if (editingCategory.value) {
      categoryStore.updateCategory(
        editingCategory.value.id,
        editingCategory.value.name
      )
      editingCategory.value = null
    }
  }
  
  const confirmDelete = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this category?')
    if (isConfirmed) {
      categoryStore.deleteCategory(id)
    }
  }
  </script>