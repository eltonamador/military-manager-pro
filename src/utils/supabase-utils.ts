export const GBM_OPTIONS = [
  { value: "1gbm", label: "1º GBM" },
  { value: "2gbm", label: "2º GBM" },
  { value: "5gbm", label: "5º GBM" },
  { value: "gaph", label: "GAPH" },
  { value: "gmaf", label: "GMAF" },
  { value: "mcpb", label: "MCPB" },
] as const;

export type GBMOption = typeof GBM_OPTIONS[number]['value'];

export const getServiceTableName = (gbm: GBMOption) => `servico_militar_${gbm}`;
export const getVehicleTableName = (gbm: GBMOption) => `servico_vtrs_${gbm}`;