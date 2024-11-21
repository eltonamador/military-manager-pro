import { VehicleTypeEquipment } from "./VehicleTypeEquipment";

interface EquipmentStatus {
  equipmentId: number;
  status: string;
  description: string;
}

interface EquipmentStatusFormProps {
  selectedGBM: string;
  selectedVTR: string;
  selectedDate: Date;
  vehicleType: string | null;
  onStatusChange: (statuses: EquipmentStatus[]) => void;
}

export const EquipmentStatusForm = ({
  selectedGBM,
  selectedVTR,
  selectedDate,
  vehicleType,
  onStatusChange,
}: EquipmentStatusFormProps) => {
  if (!selectedGBM || !selectedVTR || !vehicleType || (vehicleType !== 'ABS' && vehicleType !== 'ABT')) {
    return null;
  }

  return (
    <VehicleTypeEquipment
      selectedGBM={selectedGBM}
      selectedVTR={selectedVTR}
      selectedDate={selectedDate}
      vehicleType={vehicleType}
      onSave={onStatusChange}
    />
  );
};