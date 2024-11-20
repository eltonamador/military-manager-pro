export type MilitaryTableName = 
  | "servico_militar_1gbm"
  | "servico_militar_2gbm"
  | "servico_militar_5gbm"
  | "servico_militar_gaph"
  | "servico_militar_gmaf"
  | "servico_militar_mcpb";

export type VehicleTableName =
  | "servico_vtrs_1gbm"
  | "servico_vtrs_2gbm"
  | "servico_vtrs_5gbm"
  | "servico_vtrs_gaph"
  | "servico_vtrs_gmaf"
  | "servico_vtrs_mcpb";

export const getMilitaryTableName = (gbm: string): MilitaryTableName => {
  const tableMap: { [key: string]: MilitaryTableName } = {
    "1º GBM": "servico_militar_1gbm",
    "2º GBM": "servico_militar_2gbm",
    "MCPB": "servico_militar_mcpb",
    "5º GBM": "servico_militar_5gbm",
    "GAPH": "servico_militar_gaph",
    "GMAF": "servico_militar_gmaf"
  };
  
  const tableName = tableMap[gbm];
  if (!tableName) {
    throw new Error(`Invalid GBM: ${gbm}`);
  }
  
  return tableName;
};

export const getVehicleTableName = (gbm: string): VehicleTableName => {
  const tableMap: { [key: string]: VehicleTableName } = {
    "1º GBM": "servico_vtrs_1gbm",
    "2º GBM": "servico_vtrs_2gbm",
    "MCPB": "servico_vtrs_mcpb",
    "5º GBM": "servico_vtrs_5gbm",
    "GAPH": "servico_vtrs_gaph",
    "GMAF": "servico_vtrs_gmaf"
  };
  
  const tableName = tableMap[gbm];
  if (!tableName) {
    throw new Error(`Invalid GBM: ${gbm}`);
  }
  
  return tableName;
};