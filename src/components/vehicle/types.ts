export interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
  date: Date;
  time: string;
}

export interface EquipmentStatus {
  vtr: string;
  gbm: string;
  equipamento: string;
  status: string;
  description: string | null;
  date: string;
  time: string;
}