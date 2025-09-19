import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour TypeScript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_type: 'individual' | 'company'
          profile_data: any
          documents: any[]
          profile_completion: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_type: 'individual' | 'company'
          profile_data?: any
          documents?: any[]
          profile_completion?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_type?: 'individual' | 'company'
          profile_data?: any
          documents?: any[]
          profile_completion?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}