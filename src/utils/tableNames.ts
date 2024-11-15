export type VehicleTableName =
  | "servico_vtrs_1gbm"
  | "servico_vtrs_2gbm"
  | "servico_vtrs_5gbm"
  | "servico_vtrs_gaph"
  | "servico_vtrs_gmaf"
  | "servico_vtrs_mcpb";

export type MilitaryTableName =
  | "servico_militar_1gbm"
  | "servico_militar_2gbm"
  | "servico_militar_5gbm"
  | "servico_militar_gaph"
  | "servico_militar_gmaf"
  | "servico_militar_mcpb";

const GBM_TO_VEHICLE_TABLE: Record<string, VehicleTableName> = {
  "1º GBM": "servico_vtrs_1gbm",
  "2º GBM": "servico_vtrs_2gbm",
  "5º GBM": "servico_vtrs_5gbm",
  "GAPH": "servico_vtrs_gaph",
  "GMAF": "servico_vtrs_gmaf",
  "MCPB": "servico_vtrs_mcpb",
};

const GBM_TO_MILITARY_TABLE: Record<string, MilitaryTableName> = {
  "1º GBM": "servico_militar_1gbm",
  "2º GBM": "servico_militar_2gbm",
  "5º GBM": "servico_militar_5gbm",
  "GAPH": "servico_militar_gaph",
  "GMAF": "servico_militar_gmaf",
  "MCPB": "servico_militar_mcpb",
};

export const getVehicleTableName = (gbm: string): VehicleTableName => {
  const tableName = GBM_TO_VEHICLE_TABLE[gbm];
  if (!tableName) {
    throw new Error(`Tabela de viaturas para o GBM ${gbm} não encontrada.`);
  }
  return tableName;
};

export const getMilitaryTableName = (gbm: string): MilitaryTableName => {
  const tableName = GBM_TO_MILITARY_TABLE[gbm];
  if (!tableName) {
    throw new Error(`Tabela militar para o GBM ${gbm} não encontrada.`);
  }
  return tableName;
};