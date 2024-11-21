import { createContext, useContext, useState } from "react";
import { Vehicle, EquipmentStatus } from "./types";

interface VehicleContextType {
  selectedVTR: string;
  selectedGBM: string;
  selectedTime: string;
  status: string;
  description: string;
  vehicles: Vehicle[];
  editingIndex: number | null;
  selectedDate: Date;
  equipmentStatuses: EquipmentStatus[];
  showGoodServiceDialog: boolean;
  setSelectedVTR: (vtr: string) => void;
  setSelectedGBM: (gbm: string) => void;
  setSelectedTime: (time: string) => void;
  setStatus: (status: string) => void;
  setDescription: (description: string) => void;
  setVehicles: (vehicles: Vehicle[]) => void;
  setEditingIndex: (index: number | null) => void;
  setSelectedDate: (date: Date) => void;
  setEquipmentStatuses: (statuses: EquipmentStatus[]) => void;
  setShowGoodServiceDialog: (show: boolean) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const useVehicleState = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicleState must be used within a VehicleStateProvider");
  }
  return context;
};

export const VehicleStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedVTR, setSelectedVTR] = useState("");
  const [selectedGBM, setSelectedGBM] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showGoodServiceDialog, setShowGoodServiceDialog] = useState(false);
  const [equipmentStatuses, setEquipmentStatuses] = useState<EquipmentStatus[]>([]);

  return (
    <VehicleContext.Provider
      value={{
        selectedVTR,
        selectedGBM,
        selectedTime,
        status,
        description,
        vehicles,
        editingIndex,
        selectedDate,
        equipmentStatuses,
        showGoodServiceDialog,
        setSelectedVTR,
        setSelectedGBM,
        setSelectedTime,
        setStatus,
        setDescription,
        setVehicles,
        setEditingIndex,
        setSelectedDate,
        setEquipmentStatuses,
        setShowGoodServiceDialog,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};