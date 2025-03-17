// stores/hashtagStore.ts
import { defineStore } from 'pinia';
import { useRuntimeConfig } from '#imports';

export interface HashtagSuggestion {
  hashtag_id: number | string;
  name: string;
  usage_count: number;
}

export const useHashtagStore = defineStore('hashtag', {
  state: () => ({
    suggestions: [] as HashtagSuggestion[],
    isLoading: false,
    error: null as string | null
  }),
  
  actions: {
    async fetchSuggestions(query: string) {
      if (!query || query.trim() === '') {
        this.suggestions = [];
        return;
      }
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await fetch(`${config.public.apiBase}/api/hashtag-suggestions?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch hashtag suggestions: ${response.status}`);
        }
        
        const data = await response.json();
        this.suggestions = data;
      } catch (error: any) {
        console.error('Error fetching hashtag suggestions:', error);
        this.error = error.message;
        this.suggestions = [];
      } finally {
        this.isLoading = false;
      }
    }
  }
});