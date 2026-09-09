export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          salt: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          salt: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          salt?: string
          username?: string
        }
        Relationships: []
      }
      changelog: {
        Row: {
          body: string
          created_at: string
          entry_date: string
          id: string
          title: string
        }
        Insert: {
          body?: string
          created_at?: string
          entry_date?: string
          id?: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          entry_date?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          created_at: string
          email: string
          handled: boolean
          id: string
          kind: string
          message: string
          minecraft_name: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string
          email?: string
          handled?: boolean
          id?: string
          kind?: string
          message?: string
          minecraft_name?: string
          name?: string
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          handled?: boolean
          id?: string
          kind?: string
          message?: string
          minecraft_name?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          browser_token: string
          created_at: string
          event_id: string
          id: string
          minecraft_name: string
        }
        Insert: {
          browser_token?: string
          created_at?: string
          event_id: string
          id?: string
          minecraft_name: string
        }
        Update: {
          browser_token?: string
          created_at?: string
          event_id?: string
          id?: string
          minecraft_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string
          end_date: string | null
          event_date: string
          id: string
          location: string
          max_participants: number
          rsvp_enabled: boolean
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          end_date?: string | null
          event_date: string
          id?: string
          location?: string
          max_participants?: number
          rsvp_enabled?: boolean
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string | null
          event_date?: string
          id?: string
          location?: string
          max_participants?: number
          rsvp_enabled?: boolean
          title?: string
        }
        Relationships: []
      }
      poll_options: {
        Row: {
          created_at: string
          id: string
          label: string
          poll_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          poll_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          poll_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          browser_token: string
          created_at: string
          id: string
          option_id: string
          poll_id: string
        }
        Insert: {
          browser_token: string
          created_at?: string
          id?: string
          option_id: string
          poll_id: string
        }
        Update: {
          browser_token?: string
          created_at?: string
          id?: string
          option_id?: string
          poll_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          description: string
          id: string
          is_open: boolean
          question: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_open?: boolean
          question: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_open?: boolean
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      ranks: {
        Row: {
          color: string
          created_at: string
          description: string
          id: string
          name: string
          requirement: string
          sort_order: number
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string
          id?: string
          name: string
          requirement?: string
          sort_order?: number
        }
        Update: {
          color?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          requirement?: string
          sort_order?: number
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          announcement: string
          discord_link: string
          hero_subtitle: string
          hero_title: string
          id: string
          maintenance_enabled: boolean
          maintenance_pages: string[]
          maintenance_text: string
          opening_hours: string
          opening_hours_enabled: boolean
          rules_text: string
          server_ip: string
          updated_at: string
        }
        Insert: {
          announcement?: string
          discord_link?: string
          hero_subtitle?: string
          hero_title?: string
          id?: string
          maintenance_enabled?: boolean
          maintenance_pages?: string[]
          maintenance_text?: string
          opening_hours?: string
          opening_hours_enabled?: boolean
          rules_text?: string
          server_ip?: string
          updated_at?: string
        }
        Update: {
          announcement?: string
          discord_link?: string
          hero_subtitle?: string
          hero_title?: string
          id?: string
          maintenance_enabled?: boolean
          maintenance_pages?: string[]
          maintenance_text?: string
          opening_hours?: string
          opening_hours_enabled?: boolean
          rules_text?: string
          server_ip?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          avatar_url: string
          created_at: string
          description: string
          id: string
          name: string
          role: string
          sort_order: number
        }
        Insert: {
          avatar_url?: string
          created_at?: string
          description?: string
          id?: string
          name: string
          role?: string
          sort_order?: number
        }
        Update: {
          avatar_url?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          role?: string
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
