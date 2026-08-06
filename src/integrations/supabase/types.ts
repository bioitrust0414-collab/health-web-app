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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_type: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          notes: string | null
          package_name: string
          profile_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          booking_type: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          package_name: string
          profile_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_type?: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          package_name?: string
          profile_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_logs: {
        Row: {
          created_at: string | null
          id: string
          log_date: string
          notes: string | null
          profile_id: string | null
          sleep_hours: number | null
          water_ml: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          log_date: string
          notes?: string | null
          profile_id?: string | null
          sleep_hours?: number | null
          water_ml?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          log_date?: string
          notes?: string | null
          profile_id?: string | null
          sleep_hours?: number | null
          water_ml?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_logs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      member_points: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          points: number
          profile_id: string
          source: string | null
          source_id: string | null
          transaction_type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          points: number
          profile_id: string
          source?: string | null
          source_id?: string | null
          transaction_type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          points?: number
          profile_id?: string
          source?: string | null
          source_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_points_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          subtotal: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity?: number
          subtotal: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          subtotal?: number
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
          created_at: string | null
          final_amount: number
          id: string
          order_no: string
          payment_method: string | null
          points_earned: number | null
          points_used: number | null
          profile_id: string
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          final_amount: number
          id?: string
          order_no: string
          payment_method?: string | null
          points_earned?: number | null
          points_used?: number | null
          profile_id: string
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          final_amount?: number
          id?: string
          order_no?: string
          payment_method?: string | null
          points_earned?: number | null
          points_used?: number | null
          profile_id?: string
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_mappings: {
        Row: {
          id: string
          is_verified: boolean | null
          linked_at: string | null
          lis_patient_id: string
          profile_id: string | null
        }
        Insert: {
          id?: string
          is_verified?: boolean | null
          linked_at?: string | null
          lis_patient_id: string
          profile_id?: string | null
        }
        Update: {
          id?: string
          is_verified?: boolean | null
          linked_at?: string | null
          lis_patient_id?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_mappings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          benefits: string[] | null
          brand: string | null
          category: string
          created_at: string | null
          description: string | null
          flavor: string | null
          health_tags: string[] | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          is_active: boolean | null
          is_best_seller: boolean | null
          is_new: boolean | null
          name: string
          net_weight: string | null
          original_price: number | null
          price: number
          sku: string
          stock_quantity: number | null
          sub_category: string | null
          updated_at: string | null
        }
        Insert: {
          benefits?: string[] | null
          brand?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          flavor?: string | null
          health_tags?: string[] | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_active?: boolean | null
          is_best_seller?: boolean | null
          is_new?: boolean | null
          name: string
          net_weight?: string | null
          original_price?: number | null
          price: number
          sku: string
          stock_quantity?: number | null
          sub_category?: string | null
          updated_at?: string | null
        }
        Update: {
          benefits?: string[] | null
          brand?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          flavor?: string | null
          health_tags?: string[] | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_active?: boolean | null
          is_best_seller?: boolean | null
          is_new?: boolean | null
          name?: string
          net_weight?: string | null
          original_price?: number | null
          price?: number
          sku?: string
          stock_quantity?: number | null
          sub_category?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          birthday: string | null
          created_at: string
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          birthday?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          birthday?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          disclaimer_text: string
          id: string
          is_sent: boolean | null
          message: string
          profile_id: string | null
          title: string
          trigger_time: string
          type: string
        }
        Insert: {
          disclaimer_text: string
          id?: string
          is_sent?: boolean | null
          message: string
          profile_id?: string | null
          title: string
          trigger_time: string
          type: string
        }
        Update: {
          disclaimer_text?: string
          id?: string
          is_sent?: boolean | null
          message?: string
          profile_id?: string | null
          title?: string
          trigger_time?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          id: string
          lis_report_id: string
          pdf_path: string | null
          profile_id: string | null
          report_date: string
          summary_json: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lis_report_id: string
          pdf_path?: string | null
          profile_id?: string | null
          report_date: string
          summary_json?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lis_report_id?: string
          pdf_path?: string | null
          profile_id?: string | null
          report_date?: string
          summary_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stamp_cards: {
        Row: {
          card_type: string | null
          completed_at: string | null
          created_at: string | null
          current_stamps: number | null
          id: string
          is_completed: boolean | null
          profile_id: string
          total_stamps: number | null
        }
        Insert: {
          card_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_stamps?: number | null
          id?: string
          is_completed?: boolean | null
          profile_id: string
          total_stamps?: number | null
        }
        Update: {
          card_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_stamps?: number | null
          id?: string
          is_completed?: boolean | null
          profile_id?: string
          total_stamps?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stamp_cards_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      member_points_balance: {
        Row: {
          profile_id: string | null
          total_points: number | null
        }
        Relationships: [
          {
            foreignKeyName: "member_points_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
