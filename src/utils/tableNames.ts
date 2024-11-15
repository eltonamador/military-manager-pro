export const getVehicleTableName = (gbm: string) => {
  const tableMap: { [key: string]: string } = {
    "1º GBM": "servico_vtrs_1gbm",
    "2º GBM": "servico_vtrs_2gbm",
    "MCPB": "servico_vtrs_mcpb",
    "5º GBM": "servico_vtrs_5gbm",
    "GAPH": "servico_vtrs_gaph",
    "GMAF": "servico_vtrs_gmaf"
  };
  return tableMap[gbm];
};