import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#app'

export const useCategoryStore = defineStore('category', {
    state: () => ({
      categories: [],
    }),
    actions: {
      async fetchCategories() {
        const config = useRuntimeConfig()
        try {
          const response = await fetch(`${config.public.apiBase}/api/categories/`)
          const data = await response.json()
          this.categories = data  // Make sure data is being assigned correctly
          console.log('Fetched categories:', this.categories)  // Debug log
        } catch (error) {
          console.error('Error fetching categories:', error)
        }
      },
    async createCategory(name) {
      const config = useRuntimeConfig()
      try {
        await fetch(`${config.public.apiBase}/api/categories/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name })
        })
        await this.fetchCategories()
      } catch (error) {
        console.error('Error creating category:', error)
      }
    },
    async updateCategory(id, name) {
      const config = useRuntimeConfig()
      try {
        await fetch(`${config.public.apiBase}/api/categories/${id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name })
        })
        await this.fetchCategories()
      } catch (error) {
        console.error('Error updating category:', error)
      }
    },
    async deleteCategory(id) {
      const config = useRuntimeConfig()
      try {
        await fetch(`${config.public.apiBase}/api/categories/${id}/`, {
          method: 'DELETE'
        })
        await this.fetchCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }
})