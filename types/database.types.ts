export type NovelLink = {
  name: string
  url: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          is_premium: boolean
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          is_premium?: boolean
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          is_premium?: boolean
        }
      }
      regions: {
        Row: {
          id: number
          name: string
          code: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          code: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          code?: string
          created_at?: string
        }
      }
      genres: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      light_novels: {
        Row: {
          id: string
          title: string
          alternative_titles: string[] | null
          author: string
          region_id: number
          summary: string
          cover_image_url: string | null
          status: 'ongoing' | 'completed' | 'hiatus' | 'dropped'
          publication_year: number | null
          total_chapters: number | null
          official_links: NovelLink[] | null
          translation_links: NovelLink[] | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          alternative_titles?: string[] | null
          author: string
          region_id: number
          summary: string
          cover_image_url?: string | null
          status: 'ongoing' | 'completed' | 'hiatus' | 'dropped'
          publication_year?: number | null
          total_chapters?: number | null
          official_links?: NovelLink[] | null
          translation_links?: NovelLink[] | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          alternative_titles?: string[] | null
          author?: string
          region_id?: number
          summary?: string
          cover_image_url?: string | null
          status?: 'ongoing' | 'completed' | 'hiatus' | 'dropped'
          publication_year?: number | null
          total_chapters?: number | null
          official_links?: NovelLink[] | null
          translation_links?: NovelLink[] | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      chat_rooms: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'general' | 'region' | 'novel'
          region_id: number | null
          novel_id: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: 'general' | 'region' | 'novel'
          region_id?: number | null
          novel_id?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'general' | 'region' | 'novel'
          region_id?: number | null
          novel_id?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: string
          room_id: string
          user_id: string | null
          content: string
          is_anonymous: boolean
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id?: string | null
          content: string
          is_anonymous?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string | null
          content?: string
          is_anonymous?: boolean
          created_at?: string
        }
      }
      reading_lists: {
        Row: {
          id: string
          user_id: string
          novel_id: string
          status: 'reading' | 'completed' | 'plan_to_read' | 'dropped' | 'on_hold'
          rating: number | null
          current_chapter: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          novel_id: string
          status: 'reading' | 'completed' | 'plan_to_read' | 'dropped' | 'on_hold'
          rating?: number | null
          current_chapter?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          novel_id?: string
          status?: 'reading' | 'completed' | 'plan_to_read' | 'dropped' | 'on_hold'
          rating?: number | null
          current_chapter?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          novel_id: string
          rating: number
          title: string
          content: string
          is_spoiler: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          novel_id: string
          rating: number
          title: string
          content: string
          is_spoiler?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          novel_id?: string
          rating?: number
          title?: string
          content?: string
          is_spoiler?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
