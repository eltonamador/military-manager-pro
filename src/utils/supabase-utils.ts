export const getServiceMilitaryTableName = (gbm: string) => {
  const normalizedGBM = gbm
    .toLowerCase()
    .replace(/[º°]/g, '')
    .replace(/\s+/g, '')
    .replace(/gbm/g, 'gbm');
  return `servico_militar_${normalizedGBM}` as const;
};

export const getServiceVTRTableName = (gbm: string) => {
  const normalizedGBM = gbm
    .toLowerCase()
    .replace(/[º°]/g, '')
    .replace(/\s+/g, '')
    .replace(/gbm/g, 'gbm');
  return `servico_vtrs_${normalizedGBM}` as const;
};

export const normalizeGBMName = (gbm: string) => {
  return gbm
    .toLowerCase()
    .replace(/[º°]/g, '')
    .replace(/\s+/g, '')
    .replace(/gbm/g, 'gbm');
};