export type MilitaryTableName = 
  | "servico_militar_1gbm"
  | "servico_militar_2gbm"
  | "servico_militar_5gbm"
  | "servico_militar_gaph"
  | "servico_militar_gmaf"
  | "servico_militar_mcpb";

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