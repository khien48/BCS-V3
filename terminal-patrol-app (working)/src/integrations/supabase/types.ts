export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      paid_buses: {
        Row: {
          bus_id: string
          payment_date: string
          payment_id: string
          receipt_number: string
          teller_id: string
        }
        Insert: {
          bus_id: string
          payment_date?: string
          payment_id?: string
          receipt_number: string
          teller_id: string
        }
        Update: {
          bus_id?: string
          payment_date?: string
          payment_id?: string
          receipt_number?: string
          teller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paid_buses_teller_id_fkey"
            columns: ["teller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          contact_number: string
          created_at: string | null
          first_name: string
          id: string
          last_login: string | null
          last_name: string
          middle_name: string | null
          profile_picture: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          suffix: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          contact_number: string
          created_at?: string | null
          first_name: string
          id: string
          last_login?: string | null
          last_name: string
          middle_name?: string | null
          profile_picture?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          suffix?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          contact_number?: string
          created_at?: string | null
          first_name?: string
          id?: string
          last_login?: string | null
          last_name?: string
          middle_name?: string | null
          profile_picture?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          suffix?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          date_generated: string
          generated_by: string
          report_data: Json
          report_id: string
          report_type: Database["public"]["Enums"]["report_type"]
        }
        Insert: {
          date_generated?: string
          generated_by: string
          report_data: Json
          report_id?: string
          report_type: Database["public"]["Enums"]["report_type"]
        }
        Update: {
          date_generated?: string
          generated_by?: string
          report_data?: Json
          report_id?: string
          report_type?: Database["public"]["Enums"]["report_type"]
        }
        Relationships: [
          {
            foreignKeyName: "reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sleep_buses: {
        Row: {
          bus_id: string
          bus_name: string
          daily_fee: number
          date_time_parked: string
          days_parked: number | null
          last_updated: string | null
          plate_number: string
          recorded_by: string
          route: string
          total_fee: number | null
        }
        Insert: {
          bus_id?: string
          bus_name: string
          daily_fee?: number
          date_time_parked?: string
          days_parked?: number | null
          last_updated?: string | null
          plate_number: string
          recorded_by: string
          route: string
          total_fee?: number | null
        }
        Update: {
          bus_id?: string
          bus_name?: string
          daily_fee?: number
          date_time_parked?: string
          days_parked?: number | null
          last_updated?: string | null
          plate_number?: string
          recorded_by?: string
          route?: string
          total_fee?: number | null
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
      payment_status: "paid" | "unpaid"
      report_type: "daily_collection" | "outstanding_fines" | "revenue_summary"
      user_role: "admin" | "cashier" | "terminal_staff"
      user_status: "active" | "inactive" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      payment_status: ["paid", "unpaid"],
      report_type: ["daily_collection", "outstanding_fines", "revenue_summary"],
      user_role: ["admin", "cashier", "terminal_staff"],
      user_status: ["active", "inactive", "suspended"],
    },
  },
} as const
