export const getServiceTableName = (gbm: string) => {
  const normalizedGbm = gbm.toLowerCase().replace(/[º°]/g, '');
  return `servico_militar_${normalizedGbm}` as const;
};

export const getVehicleTableName = (gbm: string) => {
  const normalizedGbm = gbm.toLowerCase().replace(/[º°]/g, '');
  return `servico_vtrs_${normalizedGbm}` as const;
};

export const GBM_OPTIONS = [
  { value: "1gbm", label: "1º GBM" },
  { value: "2gbm", label: "2º GBM" },
  { value: "5gbm", label: "5º GBM" },
  { value: "gaph", label: "GAPH" },
  { value: "gmaf", label: "GMAF" },
  { value: "mcpb", label: "MCPB" },
] as const;

export type GBMOption = typeof GBM_OPTIONS[number]["value"];