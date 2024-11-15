export const getServiceMilitaryTableName = (gbm: string) => {
  const normalizedGBM = gbm.toLowerCase().replace(/[º°]/g, '').replace(/\s+/g, '_');
  return `servico_militar_${normalizedGBM}` as const;
};

export const getServiceVTRTableName = (gbm: string) => {
  const normalizedGBM = gbm.toLowerCase().replace(/[º°]/g, '').replace(/\s+/g, '_');
  return `servico_vtrs_${normalizedGBM}` as const;
};