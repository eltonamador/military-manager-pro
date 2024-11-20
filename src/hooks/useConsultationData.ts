import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";

const formatDateForQuery = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

type MilitaryServiceTable = Database["public"]["Tables"]["servico_militar_1gbm"]["Row"];
type VehicleServiceTable = Database["public"]["Tables"]["servico_vtrs_1gbm"]["Row"];
type OfficerServiceTable = Database["public"]["Tables"]["servico_oficial"]["Row"];

const getMilitaryTableName = (gbm: string) => {
  const formattedGBM = gbm.toLowerCase().replace('º', '').replace(' ', '');
  return `servico_militar_${formattedGBM}` as keyof Database["public"]["Tables"];
};

const getVehicleTableName = (gbm: string) => {
  const formattedGBM = gbm.toLowerCase().replace('º', '').replace(' ', '');
  return `servico_vtrs_${formattedGBM}` as keyof Database["public"]["Tables"];
};

export const useConsultationData = (
  selectedMilitaryGBMs: string[],
  selectedVehicleGBMs: string[],
  selectedVTRs: string[],
  selectedOfficerTypes: string[],
  selectedDate: Date | undefined,
) => {
  const { data: militaryData, isLoading: isMilitaryLoading } = useQuery({
    queryKey: ["military-service", selectedMilitaryGBMs, selectedDate, selectedVTRs],
    queryFn: async () => {
      if (!selectedDate || selectedMilitaryGBMs.length === 0) return [];

      const formattedDate = formatDateForQuery(selectedDate);

      const promises = selectedMilitaryGBMs.map(async (gbm) => {
        const tableName = getMilitaryTableName(gbm);
        const query = supabase
          .from(tableName)
          .select("*")
          .eq('data', formattedDate);

        if (selectedVTRs.length > 0) {
          const vtrConditions = selectedVTRs.map(prefix => `viatura.ilike.${prefix}%`);
          query.or(vtrConditions.join(','));
        }

        const { data: queryData, error } = await query;
        
        if (error) {
          console.error(`Error querying ${tableName}:`, error);
          throw error;
        }
        
        return (queryData || []) as MilitaryServiceTable[];
      });

      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: !!selectedDate && selectedMilitaryGBMs.length > 0,
  });

  const { data: vehicleData, isLoading: isVehicleLoading } = useQuery({
    queryKey: ["vehicle-service", selectedVehicleGBMs, selectedDate, selectedVTRs],
    queryFn: async () => {
      if (!selectedDate || selectedVehicleGBMs.length === 0) return [];

      const formattedDate = formatDateForQuery(selectedDate);

      const promises = selectedVehicleGBMs.map(async (gbm) => {
        const tableName = getVehicleTableName(gbm);
        const query = supabase
          .from(tableName)
          .select("*")
          .eq('data', formattedDate);

        if (selectedVTRs.length > 0) {
          const vtrConditions = selectedVTRs.map(prefix => `vtr.ilike.${prefix}%`);
          query.or(vtrConditions.join(','));
        }

        const { data: queryData, error } = await query;
        
        if (error) {
          console.error(`Error querying ${tableName}:`, error);
          throw error;
        }
        
        return (queryData || []) as VehicleServiceTable[];
      });

      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: !!selectedDate && selectedVehicleGBMs.length > 0,
  });

  const { data: officerData, isLoading: isOfficerLoading } = useQuery({
    queryKey: ["officer-service", selectedDate, selectedOfficerTypes],
    queryFn: async () => {
      if (!selectedDate || selectedOfficerTypes.length === 0) return [];

      const formattedDate = formatDateForQuery(selectedDate);
      
      const { data, error } = await supabase
        .from('servico_oficial')
        .select('*')
        .eq('data_serv_of', formattedDate)
        .in('tipo', selectedOfficerTypes)
        .not('nome_of_sup', 'is', null);

      if (error) {
        console.error('Error querying officer data:', error);
        throw error;
      }

      return (data || []) as OfficerServiceTable[];
    },
    enabled: !!selectedDate && selectedOfficerTypes.length > 0,
  });

  const formatData = () => {
    const formattedMilitaryData = militaryData?.map(item => ({
      name: item.nome_de_guerra || "",
      function: item.funcao || "",
      gbm: item.GBM || "",
      vtr: item.viatura || "",
      date: item.data ? new Date(item.data) : new Date(),
      alterations: item.alteracao_mil || "-",
      time: item.horario_inclusao || ""
    })) || [];

    const formattedVehicleData = vehicleData?.map(item => ({
      name: item.vtr || "",
      function: item.status || "",
      gbm: item.gbm || "",
      vtr: item.alteracao || "",
      date: item.data ? new Date(item.data) : new Date(),
      alterations: item.alteracao || "-",
      time: item.hora_inclusao_vtr || ""
    })) || [];

    const formattedOfficerData = officerData?.map(item => ({
      name: item.nome_of_sup || "",
      function: item.tipo || "",
      gbm: "-",
      vtr: item.vtr_sup || "-",
      date: item.data_serv_of ? new Date(item.data_serv_of) : new Date(),
      alterations: "-",
      time: item.hora_inclusao_sup || ""
    })) || [];

    return [...formattedMilitaryData, ...formattedVehicleData, ...formattedOfficerData];
  };

  return {
    data: formatData(),
    isLoading: isMilitaryLoading || isVehicleLoading || isOfficerLoading
  };
};