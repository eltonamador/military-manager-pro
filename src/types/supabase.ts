export interface ServiceMilitaryRow {
  id: number;
  created_at: string;
  GBM: string | null;
  viatura: string | null;
  nome_de_guerra: string | null;
  telefone: string | null;
  funcao: string | null;
  data: string | null;
}

export interface ServiceVehicleRow {
  id: number;
  created_at: string;
  vtr: string | null;
  status: string | null;
  alteracao: string | null;
  gbm: string | null;
  data: string | null;
}

export type GBMOption = "1gbm" | "2gbm" | "5gbm" | "gaph" | "gmaf" | "mcpb";