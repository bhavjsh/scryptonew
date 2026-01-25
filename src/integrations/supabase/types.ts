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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_orders: {
        Row: {
          color: string
          created_at: string
          customer_email: string
          customer_name: string
          estimated_price: number | null
          file_name: string | null
          file_url: string | null
          id: string
          material: string
          notes: string | null
          quantity: number
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          color: string
          created_at?: string
          customer_email: string
          customer_name: string
          estimated_price?: number | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          material: string
          notes?: string | null
          quantity?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          estimated_price?: number | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          material?: string
          notes?: string | null
          quantity?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      escrow_deposits: {
        Row: {
          amount: number
          created_at: string
          id: string
          match_id: string
          resolved_at: string | null
          status: string
          wallet_address: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          match_id: string
          resolved_at?: string | null
          status?: string
          wallet_address: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          match_id?: string
          resolved_at?: string | null
          status?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "escrow_deposits_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "skill_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          match_id: string
          resolution: string | null
          user_a_marked_at: string | null
          user_a_satisfied: boolean | null
          user_b_marked_at: string | null
          user_b_satisfied: boolean | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          match_id: string
          resolution?: string | null
          user_a_marked_at?: string | null
          user_a_satisfied?: boolean | null
          user_b_marked_at?: string | null
          user_b_satisfied?: boolean | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          match_id?: string
          resolution?: string | null
          user_a_marked_at?: string | null
          user_a_satisfied?: boolean | null
          user_b_marked_at?: string | null
          user_b_satisfied?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_sessions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "skill_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          shipping_address: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          shipping_address?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          shipping_address?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_treasury: {
        Row: {
          balance: number
          id: string
          updated_at: string
        }
        Insert: {
          balance?: number
          id?: string
          updated_at?: string
        }
        Update: {
          balance?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          name: string
          price: number
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          name: string
          price: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reward_pool: {
        Row: {
          id: string
          last_distribution_at: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          id?: string
          last_distribution_at?: string | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          id?: string
          last_distribution_at?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      skill_matches: {
        Row: {
          created_at: string
          id: string
          skill_a_teaches: string
          skill_b_teaches: string
          stake_amount: string | null
          status: string
          updated_at: string
          user_a_wallet: string
          user_b_wallet: string
        }
        Insert: {
          created_at?: string
          id?: string
          skill_a_teaches: string
          skill_b_teaches: string
          stake_amount?: string | null
          status?: string
          updated_at?: string
          user_a_wallet: string
          user_b_wallet: string
        }
        Update: {
          created_at?: string
          id?: string
          skill_a_teaches?: string
          skill_b_teaches?: string
          stake_amount?: string | null
          status?: string
          updated_at?: string
          user_a_wallet?: string
          user_b_wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_matches_skill_a_teaches_fkey"
            columns: ["skill_a_teaches"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_matches_skill_b_teaches_fkey"
            columns: ["skill_b_teaches"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string
          collateral_amount: number
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category: string
          collateral_amount?: number
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string
          collateral_amount?: number
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_name: string
          badge_type: string
          description: string | null
          earned_at: string
          id: string
          metadata: Json | null
          wallet_address: string
        }
        Insert: {
          badge_name: string
          badge_type: string
          description?: string | null
          earned_at?: string
          id?: string
          metadata?: Json | null
          wallet_address: string
        }
        Update: {
          badge_name?: string
          badge_type?: string
          description?: string | null
          earned_at?: string
          id?: string
          metadata?: Json | null
          wallet_address?: string
        }
        Relationships: []
      }
      user_balances: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          wallet_address: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          wallet_address: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          wallet_address: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          wallet_address: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      user_reputation: {
        Row: {
          created_at: string
          id: string
          reputation_score: number
          successful_sessions: number
          total_sessions: number
          updated_at: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          reputation_score?: number
          successful_sessions?: number
          total_sessions?: number
          updated_at?: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          reputation_score?: number
          successful_sessions?: number
          total_sessions?: number
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string
          id: string
          skill_id: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          skill_id: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          skill_id?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wanted_skills: {
        Row: {
          created_at: string
          id: string
          skill_id: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          skill_id: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          skill_id?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_wanted_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
