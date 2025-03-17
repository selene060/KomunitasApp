import { defineStore } from 'pinia'
import { useRuntimeConfig, useFetch } from '#imports'
import type { 
  Post, 
  CreatePostResponse, 
  InteractionResponse, 
  Comment, 
  InteractionType,
  InteractionOptions 
} from '~/types/post'
import { useAuthStore } from './auth'

export const usePostStore = defineStore('posts', {
  state: () => ({
    posts: [] as Post[],
    publicPosts: [] as Post[], // State untuk post public (For You section)
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getPosts: (state) => state.posts,
    getPublicPosts: (state) => state.publicPosts,
    getPostById: (state) => (id: number) => state.posts.find(post => post.post_id === id),
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },

  actions: {
    async fetchPosts() {
      this.loading = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()
        
        // Debug auth state
        console.log('Auth state saat fetch posts:', {
          initialized: authStore.initialized,
          authenticated: authStore.isAuthenticated,
          tokenExists: !!authStore.accessToken,
          tokenLength: authStore.accessToken ? authStore.accessToken.length : 0
        })
        
        // Tunggu inisialisasi auth selesai jika belum
        if (!authStore.initialized) {
          await authStore.initAuth()
          console.log('Auth state setelah inisialisasi:', {
            authenticated: authStore.isAuthenticated,
            tokenExists: !!authStore.accessToken
          })
        }
        
        // Periksa otentikasi
        if (!authStore.isAuthenticated) {
          throw new Error('Authentication required. Please log in.')
        }
        
        const { data, error } = await useFetch<Post[]>(`${config.public.apiBase}/api/posts/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          },
          cache: 'no-store'
        })
        
        // Debug response
        console.log('Response dari server:', {
          hasError: !!error.value,
          dataExists: !!data.value,
          dataLength: data.value ? data.value.length : 0,
          errorDetails: error.value
        })
        
        if (error.value) throw error.value
        if (!data.value) throw new Error('No data received from server')
        
        this.posts = data.value
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch posts'
        console.error('Error fetching posts:', error)
      } finally {
        this.loading = false
      }
    },

    // Method untuk fetch post public untuk section "For You"
    async fetchPublicPosts() {
      this.loading = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()
        
        // Pastikan user sudah terautentikasi
        if (!authStore.isAuthenticated) {
          await authStore.initAuth()
          if (!authStore.isAuthenticated) {
            throw new Error('Authentication required. Please log in.')
          }
        }
        
        const { data, error } = await useFetch<Post[]>(`${config.public.apiBase}/api/posts/public/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          },
          cache: 'no-store'
        })
        
        if (error.value) throw error.value
        if (!data.value) throw new Error('No data received from server')
        
        this.publicPosts = data.value
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch public posts'
        console.error('Error fetching public posts:', error)
      } finally {
        this.loading = false
      }
    },

    async createPost(formData: FormData): Promise<CreatePostResponse> {
      this.loading = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()
        
        const { data, error } = await useFetch<CreatePostResponse>(`${config.public.apiBase}/api/posts/create/`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          }
        })

        if (error.value) throw error.value
        if (!data.value) throw new Error('No response from server')
        
        // Refresh kedua list post
        await this.fetchPosts()
        
        // Jika post dibuat sebagai public, refresh public posts juga
        const privacy = formData.get('privacy')
        if (privacy === 'public') {
          await this.fetchPublicPosts()
        }
        
        return data.value
      } catch (error: any) {
        this.error = error.message || 'Failed to create post'
        if (error.response?.data?.error) {
          throw new Error(error.response.data.error)
        }
        throw new Error('Failed to create post')
      } finally {
        this.loading = false
      }
    },

    async deletePost(postId: number) {
      this.loading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()
        
        const { data, error } = await useFetch(`${config.public.apiBase}/api/posts/${postId}/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          }
        })
        
        if (error.value) throw error.value
        if (!data.value) throw new Error('No response from server')
        
        // Hapus post dari kedua array state
        this.posts = this.posts.filter(post => post.post_id !== postId)
        this.publicPosts = this.publicPosts.filter(post => post.post_id !== postId)
        
        return true
      } catch (error: any) {
        this.error = 'Failed to delete post'
        if (error.response?.data?.error) {
          throw new Error(error.response.data.error)
        }
        throw new Error('Failed to delete post')
      } finally {
        this.loading = false
      }
    },

    async reportContent(postId: number, reason: string): Promise<any> {
      this.loading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const authStore = useAuthStore();
        
        const { data, error } = await useFetch(`${config.public.apiBase}/api/posts/reports/create/`, {
          method: 'POST',
          body: {
            content_id: postId,
            reason: reason
          },
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          }
        });
        
        if (error.value) throw error.value;
        if (!data.value) throw new Error('No response from server');
        
        return data.value;
      } catch (error: any) {
        this.error = error.message || 'Failed to submit report';
        if (error.response?.data?.error) {
          throw new Error(error.response.data.error);
        }
        throw new Error('Failed to submit report');
      } finally {
        this.loading = false;
      }
    },

    async createComment(postId: number, comment: string) {
      this.error = null
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()
        
        const { data, error } = await useFetch<Comment>(`${config.public.apiBase}/api/posts/${postId}/comment/`, {
          method: 'POST',
          body: { comment },
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          }
        })

        if (error.value) throw error.value
        if (!data.value) throw new Error('No response from server')
        
        // Update di array posts
        const postIndex = this.posts.findIndex(p => p.post_id === postId)
        if (postIndex !== -1) {
          const post = this.posts[postIndex]
          this.posts[postIndex] = {
            ...post,
            comment_count: post.comment_count + 1,
            comments: post.comments ? [...post.comments, data.value] : [data.value]
          }
        }
        
        // Update di array publicPosts jika ada
        const publicPostIndex = this.publicPosts.findIndex(p => p.post_id === postId)
        if (publicPostIndex !== -1) {
          const post = this.publicPosts[publicPostIndex]
          this.publicPosts[publicPostIndex] = {
            ...post,
            comment_count: post.comment_count + 1,
            comments: post.comments ? [...post.comments, data.value] : [data.value]
          }
        }
        
        return data.value
      } catch (error: any) {
        this.error = error.message || 'Failed to create comment'
        throw error
      }
    },

    async fetchComments(postId: number) {
      this.error = null
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()
        
        const { data, error } = await useFetch<Comment[]>(`${config.public.apiBase}/api/posts/${postId}/comments/`, {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          }
        })

        if (error.value) throw error.value
        if (!data.value) throw new Error('No response from server')
        
        // Update di array posts
        const postIndex = this.posts.findIndex(p => p.post_id === postId)
        if (postIndex !== -1) {
          this.posts[postIndex] = {
            ...this.posts[postIndex],
            comments: data.value
          }
        }
        
        // Update di array publicPosts jika ada
        const publicPostIndex = this.publicPosts.findIndex(p => p.post_id === postId)
        if (publicPostIndex !== -1) {
          this.publicPosts[publicPostIndex] = {
            ...this.publicPosts[publicPostIndex],
            comments: data.value
          }
        }
        
        return data.value
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch comments'
        throw error
      }
    },

    async interactWithPost(
      postId: number,
      type: InteractionType,
      options?: InteractionOptions
    ): Promise<InteractionResponse> {
      this.error = null
      
      // Debug log
      console.log(`interactWithPost called with postId: ${postId}, type: ${type}, options:`, options)
      
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()
        
        const apiUrl = `${config.public.apiBase}/api/posts/${postId}/interact/`
        console.log(`Making API request to: ${apiUrl}`)
        console.log('Request body:', { type, ...options })
        
        const { data, error: fetchError } = await useFetch<InteractionResponse>(
          apiUrl,
          {
            method: 'POST',
            body: { type, ...options },
            headers: {
              Authorization: `Bearer ${authStore.accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
        
        console.log('API response:', data.value)
        
        if (fetchError.value) {
          console.error('Interaction error:', fetchError.value)
          throw new Error(fetchError.value.message || 'Failed to interact with post')
        }
        
        if (!data.value) {
          throw new Error('No response from server')
        }
        
        // Update di array posts
        const postIndex = this.posts.findIndex(p => p.post_id === postId)
        console.log(`Found post at index ${postIndex} for postId ${postId}`)
        
        if (postIndex !== -1) {
          this.posts[postIndex] = {
            ...this.posts[postIndex],
            like_count: data.value.like_count,
            share_count: data.value.share_count,
            is_liked: data.value.is_liked
          }
          console.log('Updated post in store:', this.posts[postIndex])
        }
        
        // Update di array publicPosts jika ada
        const publicPostIndex = this.publicPosts.findIndex(p => p.post_id === postId)
        if (publicPostIndex !== -1) {
          this.publicPosts[publicPostIndex] = {
            ...this.publicPosts[publicPostIndex],
            like_count: data.value.like_count,
            share_count: data.value.share_count,
            is_liked: data.value.is_liked
          }
        }
        
        return data.value
      } catch (error: any) {
        this.error = error.message || 'Failed to interact with post'
        throw error
      }
    },
    
    // Method untuk update post di kedua array
    updatePost(postId: number, updatedData: Partial<Post>) {
      // Update di array regular posts
      const postIndex = this.posts.findIndex(p => p.post_id === postId)
      if (postIndex !== -1) {
        this.posts[postIndex] = {
          ...this.posts[postIndex],
          ...updatedData
        }
      }
      
      // Update di array public posts jika ada
      const publicPostIndex = this.publicPosts.findIndex(p => p.post_id === postId)
      if (publicPostIndex !== -1) {
        this.publicPosts[publicPostIndex] = {
          ...this.publicPosts[publicPostIndex],
          ...updatedData
        }
      }
    },
    
    // Method untuk fetch single post berdasarkan id
    async fetchPostById(postId: number): Promise<Post | null> {
      this.loading = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const authStore = useAuthStore()
        
        const { data, error } = await useFetch<Post>(`${config.public.apiBase}/api/posts/${postId}/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          },
          cache: 'no-store'
        })
        
        if (error.value) throw error.value
        if (!data.value) throw new Error('No data received from server')
        
        // Update post di store jika sudah ada
        const postIndex = this.posts.findIndex(p => p.post_id === postId)
        if (postIndex !== -1) {
          this.posts[postIndex] = data.value
        } else {
          // Tambahkan ke store jika belum ada
          this.posts.push(data.value)
        }
        
        // Update di array publicPosts jika ada
        const publicPostIndex = this.publicPosts.findIndex(p => p.post_id === postId)
        if (publicPostIndex !== -1) {
          this.publicPosts[publicPostIndex] = data.value
        }
        
        return data.value
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch post'
        console.error('Error fetching post:', error)
        return null
      } finally {
        this.loading = false
      }
    }
  }
})