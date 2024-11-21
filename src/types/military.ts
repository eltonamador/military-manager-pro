export interface EquipmentStatus {
  equipment: string;
  status: string;
  description: string;
}

export interface Military {
  name: string;
  function: string;
  gbm: string;
  vtr: string;
  date: Date;
  alterations: string;
  time?: string;
  inclusionTime?: string;
  equipmentStatus: EquipmentStatus[];
}