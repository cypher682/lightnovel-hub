'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let supabaseClient: ReturnType<typeof createClient> | null = null

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
} catch (error) {
  console.warn('Supabase client initialization failed:', error)
}

const createMockQuery = () => {
  const mockError = { message: 'Supabase is not configured. Please set up your environment variables.' }
  
  const queryBuilder = {
    eq: () => queryBuilder,
    in: () => queryBuilder,
    or: () => queryBuilder,
    order: async () => ({ data: [], error: mockError }),
    limit: () => queryBuilder,
    single: async () => ({ data: null, error: mockError }),
  }
  
  return queryBuilder
}

export const supabase = supabaseClient || {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ 
      data: { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      } 
    }),
    signInWithPassword: async () => ({ 
      data: { user: null, session: null }, 
      error: { message: 'Supabase is not configured' } 
    }),
    signUp: async () => ({ 
      data: { user: null, session: null }, 
      error: { message: 'Supabase is not configured' } 
    }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: () => createMockQuery(),
    insert: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
    upsert: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => ({ unsubscribe: () => {} }),
    }),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

