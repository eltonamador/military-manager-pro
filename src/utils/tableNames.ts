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
  switch (gbm) {
    case "1º GBM":
      return "servico_militar_1gbm";
    case "2º GBM":
      return "servico_militar_2gbm";
    case "5º GBM":
      return "servico_militar_5gbm";
    case "GAPH":
      return "servico_militar_gaph";
    case "GMAF":
      return "servico_militar_gmaf";
    case "MCPB":
      return "servico_militar_mcpb";
    default:
      throw new Error(`Tabela militar para o GBM ${gbm} não encontrada.`);
  }
};

export const getVehicleTableName = (gbm: string): VehicleTableName => {
  switch (gbm) {
    case "1º GBM":
      return "servico_vtrs_1gbm";
    case "2º GBM":
      return "servico_vtrs_2gbm";
    case "5º GBM":
      return "servico_vtrs_5gbm";
    case "GAPH":
      return "servico_vtrs_gaph";
    case "GMAF":
      return "servico_vtrs_gmaf";
    case "MCPB":
      return "servico_vtrs_mcpb";
    default:
      throw new Error(`Tabela de viaturas para o GBM ${gbm} não encontrada.`);
  }
};