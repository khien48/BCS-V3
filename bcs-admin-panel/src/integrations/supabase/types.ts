export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_applicants: {
        Row: {
          application_date: string
          barangay: string
          bcs_clearance: boolean
          birthdate: string
          board_resolution: boolean
          business_name: string
          business_registration_number: string
          business_type: string
          city: string
          created_at: string
          digital_contract_status: string
          drug_test: boolean
          dti_registration: boolean
          email_address: string
          first_name: string
          gender: string
          id: string
          last_name: string
          mayors_permit: boolean
          middle_name: string | null
          phone_number: string
          postal_code: string
          province: string
          rejection_reason: string | null
          stall_photo: boolean
          status: string
          street_address: string
          updated_at: string
        }
        Insert: {
          application_date?: string
          barangay: string
          bcs_clearance?: boolean
          birthdate: string
          board_resolution?: boolean
          business_name: string
          business_registration_number: string
          business_type: string
          city: string
          created_at?: string
          digital_contract_status?: string
          drug_test?: boolean
          dti_registration?: boolean
          email_address: string
          first_name: string
          gender: string
          id?: string
          last_name: string
          mayors_permit?: boolean
          middle_name?: string | null
          phone_number: string
          postal_code: string
          province: string
          rejection_reason?: string | null
          stall_photo?: boolean
          status?: string
          street_address: string
          updated_at?: string
        }
        Update: {
          application_date?: string
          barangay?: string
          bcs_clearance?: boolean
          birthdate?: string
          board_resolution?: boolean
          business_name?: string
          business_registration_number?: string
          business_type?: string
          city?: string
          created_at?: string
          digital_contract_status?: string
          drug_test?: boolean
          dti_registration?: boolean
          email_address?: string
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          mayors_permit?: boolean
          middle_name?: string | null
          phone_number?: string
          postal_code?: string
          province?: string
          rejection_reason?: string | null
          stall_photo?: boolean
          status?: string
          street_address?: string
          updated_at?: string
        }
        Relationships: []
      }
      applicants: {
        Row: {
          application_date: string
          barangay: string
          bcs_clearance: boolean
          birthdate: string
          board_resolution: boolean
          business_name: string
          business_registration_number: string
          business_type: string
          city: string
          created_at: string
          digital_contract_status: string
          drug_test: boolean
          dti_registration: boolean
          email_address: string
          first_name: string
          gender: string
          id: string
          last_name: string
          mayors_permit: boolean
          middle_name: string | null
          phone_number: string
          postal_code: string
          province: string
          rejection_reason: string | null
          stall_photo: boolean
          status: string
          street_address: string
          updated_at: string
        }
        Insert: {
          application_date?: string
          barangay: string
          bcs_clearance?: boolean
          birthdate: string
          board_resolution?: boolean
          business_name: string
          business_registration_number: string
          business_type: string
          city: string
          created_at?: string
          digital_contract_status?: string
          drug_test?: boolean
          dti_registration?: boolean
          email_address: string
          first_name: string
          gender: string
          id?: string
          last_name: string
          mayors_permit?: boolean
          middle_name?: string | null
          phone_number: string
          postal_code: string
          province: string
          rejection_reason?: string | null
          stall_photo?: boolean
          status?: string
          street_address: string
          updated_at?: string
        }
        Update: {
          application_date?: string
          barangay?: string
          bcs_clearance?: boolean
          birthdate?: string
          board_resolution?: boolean
          business_name?: string
          business_registration_number?: string
          business_type?: string
          city?: string
          created_at?: string
          digital_contract_status?: string
          drug_test?: boolean
          dti_registration?: boolean
          email_address?: string
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          mayors_permit?: boolean
          middle_name?: string | null
          phone_number?: string
          postal_code?: string
          province?: string
          rejection_reason?: string | null
          stall_photo?: boolean
          status?: string
          street_address?: string
          updated_at?: string
        }
        Relationships: []
      }
      bus_inventory: {
        Row: {
          body_number: string
          bus_number: string
          capacity: number | null
          created_at: string | null
          id: string
          operator_name: string
          plate_number: string | null
          route: string
          status: string
          updated_at: string | null
        }
        Insert: {
          body_number: string
          bus_number: string
          capacity?: number | null
          created_at?: string | null
          id?: string
          operator_name: string
          plate_number?: string | null
          route: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          body_number?: string
          bus_number?: string
          capacity?: number | null
          created_at?: string | null
          id?: string
          operator_name?: string
          plate_number?: string | null
          route?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bus_schedules: {
        Row: {
          body_no: string | null
          bound: string
          bus_no: string
          created_at: string
          date: string | null
          id: string
          lane: string | null
          operator: string
          time: string
          time_type: string
          updated_at: string
        }
        Insert: {
          body_no?: string | null
          bound: string
          bus_no: string
          created_at?: string
          date?: string | null
          id?: string
          lane?: string | null
          operator: string
          time: string
          time_type: string
          updated_at?: string
        }
        Update: {
          body_no?: string | null
          bound?: string
          bus_no?: string
          created_at?: string
          date?: string | null
          id?: string
          lane?: string | null
          operator?: string
          time?: string
          time_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          contact: string
          created_at: string
          date: string
          description: string
          id: string
          name: string
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          contact: string
          created_at?: string
          date?: string
          description: string
          id?: string
          name: string
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          contact?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          name?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      dispatch_history: {
        Row: {
          body_no: string | null
          bound: string
          bus_no: string
          created_at: string
          dispatched_at: string
          dispatched_by: string
          id: string
          lane: string | null
          operator: string
          schedule_id: string
          time: string
          time_type: string
        }
        Insert: {
          body_no?: string | null
          bound: string
          bus_no: string
          created_at?: string
          dispatched_at?: string
          dispatched_by: string
          id?: string
          lane?: string | null
          operator: string
          schedule_id: string
          time: string
          time_type: string
        }
        Update: {
          body_no?: string | null
          bound?: string
          bus_no?: string
          created_at?: string
          dispatched_at?: string
          dispatched_by?: string
          id?: string
          lane?: string | null
          operator?: string
          schedule_id?: string
          time?: string
          time_type?: string
        }
        Relationships: []
      }
      fare_matrix: {
        Row: {
          created_at: string | null
          destination: string
          distance_km: number | null
          fare_amount: number
          id: string
          route: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          destination: string
          distance_km?: number | null
          fare_amount: number
          id?: string
          route: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          destination?: string
          distance_km?: number | null
          fare_amount?: number
          id?: string
          route?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lease_contract_renewals: {
        Row: {
          application_date: string | null
          barangay: string | null
          bcs_clearance: boolean | null
          birthdate: string | null
          board_resolution: boolean | null
          business_name: string | null
          business_registration_number: string | null
          business_type: string | null
          city: string | null
          created_at: string | null
          digital_contract_status: string | null
          drug_test: boolean | null
          dti_registration: boolean | null
          due_contract: string | null
          email_address: string | null
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          mayors_permit: boolean | null
          middle_name: string | null
          phone_number: string | null
          postal_code: string | null
          province: string | null
          rejection_reason: string | null
          renewal_applicant: string
          stall_photo: boolean | null
          start_contract: string | null
          status: string | null
          street_address: string | null
          updated_at: string | null
        }
        Insert: {
          application_date?: string | null
          barangay?: string | null
          bcs_clearance?: boolean | null
          birthdate?: string | null
          board_resolution?: boolean | null
          business_name?: string | null
          business_registration_number?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string | null
          digital_contract_status?: string | null
          drug_test?: boolean | null
          dti_registration?: boolean | null
          due_contract?: string | null
          email_address?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          mayors_permit?: boolean | null
          middle_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          province?: string | null
          rejection_reason?: string | null
          renewal_applicant: string
          stall_photo?: boolean | null
          start_contract?: string | null
          status?: string | null
          street_address?: string | null
          updated_at?: string | null
        }
        Update: {
          application_date?: string | null
          barangay?: string | null
          bcs_clearance?: boolean | null
          birthdate?: string | null
          board_resolution?: boolean | null
          business_name?: string | null
          business_registration_number?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string | null
          digital_contract_status?: string | null
          drug_test?: boolean | null
          dti_registration?: boolean | null
          due_contract?: string | null
          email_address?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          mayors_permit?: boolean | null
          middle_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          province?: string | null
          rejection_reason?: string | null
          renewal_applicant?: string
          stall_photo?: boolean | null
          start_contract?: string | null
          status?: string | null
          street_address?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      new_applicants: {
        Row: {
          applicant_id: string | null
          application_date: string
          barangay: string
          bcs_clearance: boolean
          birthdate: string
          board_resolution: boolean
          business_name: string
          business_registration_number: string
          business_type: string
          city: string
          created_at: string
          drug_test: boolean
          dti_registration: boolean
          email_address: string
          first_name: string
          gender: string
          id: string
          last_name: string
          mayors_permit: boolean
          middle_name: string | null
          phone_number: string
          postal_code: string
          province: string
          rejection_reason: string | null
          stall_number: string | null
          stall_photo: boolean
          status: string
          street_address: string
          updated_at: string
        }
        Insert: {
          applicant_id?: string | null
          application_date?: string
          barangay: string
          bcs_clearance?: boolean
          birthdate: string
          board_resolution?: boolean
          business_name: string
          business_registration_number: string
          business_type: string
          city: string
          created_at?: string
          drug_test?: boolean
          dti_registration?: boolean
          email_address: string
          first_name: string
          gender: string
          id?: string
          last_name: string
          mayors_permit?: boolean
          middle_name?: string | null
          phone_number: string
          postal_code: string
          province: string
          rejection_reason?: string | null
          stall_number?: string | null
          stall_photo?: boolean
          status?: string
          street_address: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string | null
          application_date?: string
          barangay?: string
          bcs_clearance?: boolean
          birthdate?: string
          board_resolution?: boolean
          business_name?: string
          business_registration_number?: string
          business_type?: string
          city?: string
          created_at?: string
          drug_test?: boolean
          dti_registration?: boolean
          email_address?: string
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          mayors_permit?: boolean
          middle_name?: string | null
          phone_number?: string
          postal_code?: string
          province?: string
          rejection_reason?: string | null
          stall_number?: string | null
          stall_photo?: boolean
          status?: string
          street_address?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      payment_history: {
        Row: {
          amount_due: number
          amount_paid: number
          bill_id: string | null
          change_amount: number | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string
          receipt_number: string
          teller_id: string | null
          tenant_id: string
        }
        Insert: {
          amount_due: number
          amount_paid: number
          bill_id?: string | null
          change_amount?: number | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string
          receipt_number: string
          teller_id?: string | null
          tenant_id: string
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          bill_id?: string | null
          change_amount?: number | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string
          receipt_number?: string
          teller_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "tenant_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_teller_id_fkey"
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
      registered_buses: {
        Row: {
          barangay: string
          birthdate: string
          city: string
          contact_number: string
          created_at: string | null
          email_address: string
          first_name: string
          franchise_document_url: string
          id: string
          last_name: string
          middle_name: string | null
          plate_number: string
          postal_code: string
          province: string
          rejection_reason: string | null
          route: string
          status: string | null
          street_address: string
          suffix: string | null
          updated_at: string | null
        }
        Insert: {
          barangay: string
          birthdate: string
          city: string
          contact_number: string
          created_at?: string | null
          email_address: string
          first_name: string
          franchise_document_url: string
          id?: string
          last_name: string
          middle_name?: string | null
          plate_number: string
          postal_code: string
          province: string
          rejection_reason?: string | null
          route: string
          status?: string | null
          street_address: string
          suffix?: string | null
          updated_at?: string | null
        }
        Update: {
          barangay?: string
          birthdate?: string
          city?: string
          contact_number?: string
          created_at?: string | null
          email_address?: string
          first_name?: string
          franchise_document_url?: string
          id?: string
          last_name?: string
          middle_name?: string | null
          plate_number?: string
          postal_code?: string
          province?: string
          rejection_reason?: string | null
          route?: string
          status?: string | null
          street_address?: string
          suffix?: string | null
          updated_at?: string | null
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
      routes: {
        Row: {
          created_at: string | null
          destination: string
          distance_km: number | null
          estimated_duration: number | null
          id: string
          origin: string
          route_name: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          destination: string
          distance_km?: number | null
          estimated_duration?: number | null
          id?: string
          origin: string
          route_name: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          destination?: string
          distance_km?: number | null
          estimated_duration?: number | null
          id?: string
          origin?: string
          route_name?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
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
      stall_details: {
        Row: {
          birthdate: string | null
          business_name: string | null
          business_type: string | null
          contact_number: string | null
          created_at: string | null
          email: string | null
          home_address: string | null
          id: string
          stall_no: string
          tenant_name: string
        }
        Insert: {
          birthdate?: string | null
          business_name?: string | null
          business_type?: string | null
          contact_number?: string | null
          created_at?: string | null
          email?: string | null
          home_address?: string | null
          id?: string
          stall_no: string
          tenant_name: string
        }
        Update: {
          birthdate?: string | null
          business_name?: string | null
          business_type?: string | null
          contact_number?: string | null
          created_at?: string | null
          email?: string | null
          home_address?: string | null
          id?: string
          stall_no?: string
          tenant_name?: string
        }
        Relationships: []
      }
      tenant_bills: {
        Row: {
          amount: number
          bill_type: string
          created_at: string | null
          due_date: string
          id: string
          status: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          bill_type: string
          created_at?: string | null
          due_date: string
          id?: string
          status?: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bill_type?: string
          created_at?: string | null
          due_date?: string
          id?: string
          status?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tenant_profiles: {
        Row: {
          applicant_id: string | null
          application_date: string | null
          barangay: string | null
          birthdate: string | null
          business_name: string | null
          business_registration_number: string | null
          business_type: string | null
          city: string | null
          contact_number: string | null
          contract_due: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          move_in_date: string | null
          postal_code: string | null
          province: string | null
          start_contract: string | null
          street_address: string | null
          updated_at: string | null
        }
        Insert: {
          applicant_id?: string | null
          application_date?: string | null
          barangay?: string | null
          birthdate?: string | null
          business_name?: string | null
          business_registration_number?: string | null
          business_type?: string | null
          city?: string | null
          contact_number?: string | null
          contract_due?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          move_in_date?: string | null
          postal_code?: string | null
          province?: string | null
          start_contract?: string | null
          street_address?: string | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string | null
          application_date?: string | null
          barangay?: string | null
          birthdate?: string | null
          business_name?: string | null
          business_registration_number?: string | null
          business_type?: string | null
          city?: string | null
          contact_number?: string | null
          contract_due?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          move_in_date?: string | null
          postal_code?: string | null
          province?: string | null
          start_contract?: string | null
          street_address?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_profiles_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      terminal_lanes: {
        Row: {
          assigned_route: string | null
          created_at: string | null
          id: string
          lane_number: string
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_route?: string | null
          created_at?: string | null
          id?: string
          lane_number: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          assigned_route?: string | null
          created_at?: string | null
          id?: string
          lane_number?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      tenant_profiles_formatted: {
        Row: {
          applicant_id: string | null
          application_date: string | null
          barangay: string | null
          birthdate: string | null
          business_name: string | null
          business_registration_number: string | null
          business_type: string | null
          city: string | null
          contact_number: string | null
          contract_due: string | null
          created_at: string | null
          email: string | null
          formatted_contract_due: string | null
          formatted_start_contract: string | null
          full_name: string | null
          gender: string | null
          id: string | null
          move_in_date: string | null
          postal_code: string | null
          province: string | null
          start_contract: string | null
          street_address: string | null
          updated_at: string | null
        }
        Insert: {
          applicant_id?: string | null
          application_date?: string | null
          barangay?: string | null
          birthdate?: string | null
          business_name?: string | null
          business_registration_number?: string | null
          business_type?: string | null
          city?: string | null
          contact_number?: string | null
          contract_due?: string | null
          created_at?: string | null
          email?: string | null
          formatted_contract_due?: never
          formatted_start_contract?: never
          full_name?: string | null
          gender?: string | null
          id?: string | null
          move_in_date?: string | null
          postal_code?: string | null
          province?: string | null
          start_contract?: string | null
          street_address?: string | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string | null
          application_date?: string | null
          barangay?: string | null
          birthdate?: string | null
          business_name?: string | null
          business_registration_number?: string | null
          business_type?: string | null
          city?: string | null
          contact_number?: string | null
          contract_due?: string | null
          created_at?: string | null
          email?: string | null
          formatted_contract_due?: never
          formatted_start_contract?: never
          full_name?: string | null
          gender?: string | null
          id?: string | null
          move_in_date?: string | null
          postal_code?: string | null
          province?: string | null
          start_contract?: string | null
          street_address?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_profiles_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_all_sleep_buses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
    Enums: {
      payment_status: ["paid", "unpaid"],
      report_type: ["daily_collection", "outstanding_fines", "revenue_summary"],
      user_role: ["admin", "cashier", "terminal_staff"],
      user_status: ["active", "inactive", "suspended"],
    },
  },
} as const
