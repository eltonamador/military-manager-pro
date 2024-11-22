import { useQuery } from "@tanstack/react-query";
import { fetchMilitaryData } from "./consultation/useMilitaryData";
import { fetchVehicleData } from "./consultation/useVehicleData";
import { fetchOfficerData } from "./consultation/useOfficerData";
import { fetchEquipmentData } from "./consultation/useEquipmentData";

export const useConsultationData = (
  selectedMilitaryGBMs: string[],
  selectedVehicleGBMs: string[],
  selectedVTRs: string[],
  selectedOfficerTypes: string[],
  selectedDate: Date | undefined,
) => {
  const { data: militaryData, isLoading: isMilitaryLoading } = useQuery({
    queryKey: ["military-service", selectedMilitaryGBMs, selectedDate, selectedVTRs],
    queryFn: () => selectedDate ? fetchMilitaryData(selectedMilitaryGBMs, selectedVTRs, selectedDate) : Promise.resolve([]),
    enabled: !!selectedDate && selectedMilitaryGBMs.length > 0,
  });

  const { data: vehicleData, isLoading: isVehicleLoading } = useQuery({
    queryKey: ["vehicle-service", selectedVehicleGBMs, selectedDate, selectedVTRs],
    queryFn: () => selectedDate ? fetchVehicleData(selectedVehicleGBMs, selectedVTRs, selectedDate) : Promise.resolve([]),
    enabled: !!selectedDate && selectedVehicleGBMs.length > 0,
  });

  const { data: officerData, isLoading: isOfficerLoading } = useQuery({
    queryKey: ["officer-service", selectedDate, selectedOfficerTypes],
    queryFn: () => selectedDate ? fetchOfficerData(selectedDate, selectedOfficerTypes) : Promise.resolve([]),
    enabled: !!selectedDate && selectedOfficerTypes.length > 0,
  });

  const { data: equipmentData, isLoading: isEquipmentLoading } = useQuery({
    queryKey: ["equipment-status", selectedVehicleGBMs, selectedDate, selectedVTRs],
    queryFn: () => selectedDate ? fetchEquipmentData(selectedVehicleGBMs, selectedVTRs, selectedDate) : Promise.resolve([]),
    enabled: !!selectedDate && (selectedVehicleGBMs.length > 0 || selectedVTRs.length > 0),
  });

  const formatData = () => {
    const formattedMilitaryData = militaryData?.flat().map(item => ({
      name: item.nome_de_guerra || "",
      function: item.funcao || "",
      gbm: item.GBM || "",
      vtr: item.viatura || "",
      date: item.data ? new Date(item.data) : new Date(),
      alterations: item.alteracao_mil || "-",
      time: item.horario_inclusao || "",
      equipmentStatus: []
    })) || [];

    const formattedVehicleData = vehicleData?.flat().map(item => ({
      name: item.vtr || "",
      function: item.status || "",
      gbm: item.gbm || "",
      vtr: item.alteracao || "",
      date: item.data ? new Date(item.data) : new Date(),
      alterations: item.alteracao || "-",
      time: item.hora_inclusao_vtr || "",
      equipmentStatus: equipmentData
        ?.filter(eq => eq.vtr === item.vtr)
        ?.map(eq => ({
          equipment: eq.equipamento || "",
          status: eq.status || "",
          description: eq.description || "-"
        })) || []
    })) || [];

    const formattedOfficerData = officerData?.map(item => ({
      name: item.nome_of_sup || "",
      function: item.tipo || "",
      gbm: "-",
      vtr: item.vtr_sup || "-",
      date: item.data_serv_of ? new Date(item.data_serv_of) : new Date(),
      alterations: "-",
      time: item.hora_inclusao_sup || "",
      equipmentStatus: []
    })) || [];

    return [...formattedMilitaryData, ...formattedVehicleData, ...formattedOfficerData];
  };

  return {
    data: formatData(),
    isLoading: isMilitaryLoading || isVehicleLoading || isOfficerLoading || isEquipmentLoading
  };
};