export interface Comment {
    comment_id: number
    user_id: number
    username: string
    comment: string
    created_at: string
  }
  
  export interface Media {
    url: string
    type: string
  }
  

  export interface Post {
    post_id: number
    user_id: number
    caption: string
    created_at: string
    post_type: 'general' | 'community';
    community_id?: number;
    privacy?: 'public' | 'private';
    media: Media[]
    comment_count: number
    username: string
    like_count: number
    share_count: number
    is_liked: boolean
    comments: Comment[]
  }
  
  export interface ShareUrls {
    facebook: string
    twitter: string
    linkedin: string
  }
  
  export interface InteractionResponse {
    status: string
    like_count: number
    share_count: number
    is_liked: boolean
  }
  
  export interface CreatePostResponse {
    message: string
    post_id: number
  }
  
  export type Platform = 'facebook' | 'twitter' | 'linkedin'
  
  export type InteractionType = 'like' | 'share'
  
  export interface InteractionOptions {
    platform?: string
    comment?: string
    shared_url?:string
  }
