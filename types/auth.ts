// types/auth.ts
export interface User {
    id: number
    email: string
    username: string
    role: string
    profile_picture: string | null
    bio: string | null
  }
  
  export interface AuthResponse {
    user: User
    access: string
    refresh: string
  }
  
  export interface LoginCredentials {
    email: string
    password: string
  }
  
 