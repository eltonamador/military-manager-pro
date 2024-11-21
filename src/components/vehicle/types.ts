export interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
  date: Date;
  time: string;
}

export interface EquipmentStatus {
  equipmentId: number;
  status: string;
  description: string;
}