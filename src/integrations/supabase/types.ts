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
      militares_geral: {
        Row: {
          created_at: string | null
          id: number
          nome_guerra: string
          telefone: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          nome_guerra: string
          telefone?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          nome_guerra?: string
          telefone?: string | null
        }
        Relationships: []
      }
      oficiais_de_area: {
        Row: {
          area_number: string | null
          created_at: string
          id: number
          nome_guerra_of_area: string | null
        }
        Insert: {
          area_number?: string | null
          created_at?: string
          id?: number
          nome_guerra_of_area?: string | null
        }
        Update: {
          area_number?: string | null
          created_at?: string
          id?: number
          nome_guerra_of_area?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          gbm: string | null
          id: string
          matricula: string
          nome_guerra: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          gbm?: string | null
          id: string
          matricula: string
          nome_guerra: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          gbm?: string | null
          id?: string
          matricula?: string
          nome_guerra?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      servico_militar_1gbm: {
        Row: {
          alteracao_mil: string | null
          created_at: string
          data: string | null
          funcao: string | null
          GBM: string | null
          horario_inclusao: string | null
          id: number
          nome_de_guerra: string | null
          telefone: string | null
          viatura: string | null
        }
        Insert: {
          alteracao_mil?: string | null
          created_at?: string
          data?: string | null
          funcao?: string | null
          GBM?: string | null
          horario_inclusao?: string | null
          id?: number
          nome_de_guerra?: string | null
          telefone?: string | null
          viatura?: string | null
        }
        Update: {
          alteracao_mil?: string | null
          created_at?: string
          data?: string | null
          funcao?: string | null
          GBM?: string | null
          horario_inclusao?: string | null
          id?: number
          nome_de_guerra?: string | null
          telefone?: string | null
          viatura?: string | null
        }
        Relationships: []
      }
      servico_militar_2gbm: {
        Row: {
          alteracao_mil: string | null
          created_at: string
          data: string | null
          funcao: string | null
          GBM: string | null
          horario_inclusao: string | null
          id: number
          nome_de_guerra: string | null
          telefone: string | null
          viatura: string | null
        }
        Insert: {
          alteracao_mil?: string | null
          created_at?: string
          data?: string | null
          funcao?: string | null
          GBM?: string | null
          horario_inclusao?: string | null
          id?: number
          nome_de_guerra?: string | null
          telefone?: string | null
          viatura?: string | null
        }
        Update: {
          alteracao_mil?: string | null
          created_at?: string
          data?: string | null
          funcao?: string | null
          GBM?: string | null
          horario_inclusao?: string | null
          id?: number
          nome_de_guerra?: string | null
          telefone?: string | null
          viatura?: string | null
        }
        Relationships: []
      }
      servico_militar_5gbm: {
        Row: {
          alteracao_mil: string | null
          created_at: string
          data: string | null
          funcao: string | null
          GBM: string | null
          horario_inclusao: string | null
          id: number
          nome_de_guerra: string | null
          telefone: string | null
          viatura: string | null
        }
        Insert: {
          alteracao_mil?: string | null
          created_at?: string
          data?: string | null
          funcao?: string | null
          GBM?: string | null
          horario_inclusao?: string | null
          id?: number
          nome_de_guerra?: string | null
          telefone?: string | null
          viatura?: string | null
        }
        Update: {
          alteracao_mil?: string | null
          created_at?: string
          data?: string | null
          funcao?: string | null
          GBM?: string | null
          horario_inclusao?: string | null
          id?: number
          nome_de_guerra?: string | null
          telefone?: string | null
          viatura?: string | null
        }
        Relationships: []
      }
      servico_militar_gaph: {
        Row: {
          alteracao_mil: string | null
          created_at: string
          data: string | null
          funcao: string | null
          GBM: string | null
          horario_inclusao: string | null
          id: number
          nome_de_guerra: string | null
          telefone: string | null
          viatura: string | null
        }
        Insert: {
          alteracao_mil?: string | null
          created_at?: string
          data?: string | null
          funcao?: string | null
          GBM?: string | null
          horario_inclusao?: string | null
          id?: number
          nome_de_guerra?: string | null
          telefone?: string | null
          viatura?: string | null
        }
        Update: {
          alteracao_mil?: string | null
          created_at?: string
          data?: string | null
          funcao?: string | null
          GBM?: string | null
          horario_inclusao?: string | null
          id?: number
          nome_de_guerra?: string | null
          telefone?: string | null
          viatura?: string | null
        }
        Relationships: []
      }
      servico_militar_gmaf: {
        Row: {
          alteracao_mil: string | null
          created_at: string
          data: string | null
          funcao: string | null
          GBM: string | null
          horario_inclusao: string | null
          id: number
          nome_de_guerra: string | null
          telefone: string | null
          viatura: string | null
        }
        Insert: {
          alteracao_mil?: string | null
          created_at?: string
          data?: string | null
          funcao?: string | null
          GBM?: string | null
          horario_inclusao?: string | null
          id?: number
          nome_de_guerra?: string | null
          telefone?: string | null
          viatura?: string | null
        }
        Update: {
          alteracao_mil?: string | null
          created_at?: string
          data?: string | null
          funcao?: string | null
          GBM?: string | null
          horario_inclusao?: string | null
          id?: number
          nome_de_guerra?: string | null
          telefone?: string | null
          viatura?: string | null
        }
        Relationships: []
      }
      servico_militar_mcpb: {
        Row: {
          alteracao_mil: string | null
          created_at: string
          data: string | null
          funcao: string | null
          GBM: string | null
          horario_inclusao: string | null
          id: number
          nome_de_guerra: string | null
          telefone: string | null
          viatura: string | null
        }
        Insert: {
          alteracao_mil?: string | null
          created_at?: string
          data?: string | null
          funcao?: string | null
          GBM?: string | null
          horario_inclusao?: string | null
          id?: number
          nome_de_guerra?: string | null
          telefone?: string | null
          viatura?: string | null
        }
        Update: {
          alteracao_mil?: string | null
          created_at?: string
          data?: string | null
          funcao?: string | null
          GBM?: string | null
          horario_inclusao?: string | null
          id?: number
          nome_de_guerra?: string | null
          telefone?: string | null
          viatura?: string | null
        }
        Relationships: []
      }
      servico_oficial: {
        Row: {
          created_at: string
          data_serv_of: string | null
          hora_inclusao_sup: string | null
          id: number
          nome_of_sup: string | null
          tipo: string | null
          vtr_sup: string | null
        }
        Insert: {
          created_at?: string
          data_serv_of?: string | null
          hora_inclusao_sup?: string | null
          id?: number
          nome_of_sup?: string | null
          tipo?: string | null
          vtr_sup?: string | null
        }
        Update: {
          created_at?: string
          data_serv_of?: string | null
          hora_inclusao_sup?: string | null
          id?: number
          nome_of_sup?: string | null
          tipo?: string | null
          vtr_sup?: string | null
        }
        Relationships: []
      }
      servico_vtrs_1gbm: {
        Row: {
          alteracao: string | null
          created_at: string
          data: string | null
          gbm: string | null
          hora_inclusao_vtr: string | null
          id: number
          status: string | null
          vtr: string | null
        }
        Insert: {
          alteracao?: string | null
          created_at?: string
          data?: string | null
          gbm?: string | null
          hora_inclusao_vtr?: string | null
          id?: number
          status?: string | null
          vtr?: string | null
        }
        Update: {
          alteracao?: string | null
          created_at?: string
          data?: string | null
          gbm?: string | null
          hora_inclusao_vtr?: string | null
          id?: number
          status?: string | null
          vtr?: string | null
        }
        Relationships: []
      }
      servico_vtrs_2gbm: {
        Row: {
          alteracao: string | null
          created_at: string
          data: string | null
          gbm: string | null
          hora_inclusao_vtr: string | null
          id: number
          status: string | null
          vtr: string | null
        }
        Insert: {
          alteracao?: string | null
          created_at?: string
          data?: string | null
          gbm?: string | null
          hora_inclusao_vtr?: string | null
          id?: number
          status?: string | null
          vtr?: string | null
        }
        Update: {
          alteracao?: string | null
          created_at?: string
          data?: string | null
          gbm?: string | null
          hora_inclusao_vtr?: string | null
          id?: number
          status?: string | null
          vtr?: string | null
        }
        Relationships: []
      }
      servico_vtrs_5gbm: {
        Row: {
          alteracao: string | null
          created_at: string
          data: string | null
          gbm: string | null
          hora_inclusao_vtr: string | null
          id: number
          status: string | null
          vtr: string | null
        }
        Insert: {
          alteracao?: string | null
          created_at?: string
          data?: string | null
          gbm?: string | null
          hora_inclusao_vtr?: string | null
          id?: number
          status?: string | null
          vtr?: string | null
        }
        Update: {
          alteracao?: string | null
          created_at?: string
          data?: string | null
          gbm?: string | null
          hora_inclusao_vtr?: string | null
          id?: number
          status?: string | null
          vtr?: string | null
        }
        Relationships: []
      }
      servico_vtrs_gaph: {
        Row: {
          alteracao: string | null
          created_at: string
          data: string | null
          gbm: string | null
          hora_inclusao_vtr: string | null
          id: number
          status: string | null
          vtr: string | null
        }
        Insert: {
          alteracao?: string | null
          created_at?: string
          data?: string | null
          gbm?: string | null
          hora_inclusao_vtr?: string | null
          id?: number
          status?: string | null
          vtr?: string | null
        }
        Update: {
          alteracao?: string | null
          created_at?: string
          data?: string | null
          gbm?: string | null
          hora_inclusao_vtr?: string | null
          id?: number
          status?: string | null
          vtr?: string | null
        }
        Relationships: []
      }
      servico_vtrs_gmaf: {
        Row: {
          alteracao: string | null
          created_at: string
          data: string | null
          gbm: string | null
          hora_inclusao_vtr: string | null
          id: number
          status: string | null
          vtr: string | null
        }
        Insert: {
          alteracao?: string | null
          created_at?: string
          data?: string | null
          gbm?: string | null
          hora_inclusao_vtr?: string | null
          id?: number
          status?: string | null
          vtr?: string | null
        }
        Update: {
          alteracao?: string | null
          created_at?: string
          data?: string | null
          gbm?: string | null
          hora_inclusao_vtr?: string | null
          id?: number
          status?: string | null
          vtr?: string | null
        }
        Relationships: []
      }
      servico_vtrs_mcpb: {
        Row: {
          alteracao: string | null
          created_at: string
          data: string | null
          gbm: string | null
          hora_inclusao_vtr: string | null
          id: number
          status: string | null
          vtr: string | null
        }
        Insert: {
          alteracao?: string | null
          created_at?: string
          data?: string | null
          gbm?: string | null
          hora_inclusao_vtr?: string | null
          id?: number
          status?: string | null
          vtr?: string | null
        }
        Update: {
          alteracao?: string | null
          created_at?: string
          data?: string | null
          gbm?: string | null
          hora_inclusao_vtr?: string | null
          id?: number
          status?: string | null
          vtr?: string | null
        }
        Relationships: []
      }
      superior_de_dia: {
        Row: {
          created_at: string
          id: number
          nome_guerra_sup: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          nome_guerra_sup?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          nome_guerra_sup?: string | null
        }
        Relationships: []
      }
      viaturas: {
        Row: {
          alteracao: string | null
          created_at: string
          id: number
          prefixo: string | null
          status: string | null
        }
        Insert: {
          alteracao?: string | null
          created_at?: string
          id?: number
          prefixo?: string | null
          status?: string | null
        }
        Update: {
          alteracao?: string | null
          created_at?: string
          id?: number
          prefixo?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_military_service_exists: {
        Args: {
          p_nome: string
          p_data: string
          p_gbm: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
