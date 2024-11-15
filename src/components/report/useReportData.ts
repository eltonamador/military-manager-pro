import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ServiceMilitaryRow, ServiceVehicleRow, GBMOption } from "@/types/supabase";
import { Military, Vehicle } from "@/types/service";

export const useReportData = (selectedDate: Date, selectedGBM: GBMOption) => {
  const [serviceMilitaryList, setServiceMilitaryList] = useState<Military[]>([]);
  const [serviceVehicleList, setServiceVehicleList] = useState<Vehicle[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedDate) {
          setServiceMilitaryList([]);
          setServiceVehicleList([]);
          return;
        }

        const formattedDate = format(selectedDate, 'yyyy-MM-dd');

        const [militaryResponse, vehicleResponse] = await Promise.all([
          supabase
            .from(`servico_militar_${selectedGBM}`)
            .select('*')
            .eq('data', formattedDate),
          supabase
            .from(`servico_vtrs_${selectedGBM}`)
            .select('*')
            .eq('data', formattedDate)
        ]);

        if (militaryResponse.error) throw militaryResponse.error;
        if (vehicleResponse.error) throw vehicleResponse.error;

        const militaryData = militaryResponse.data as ServiceMilitaryRow[];
        const vehicleData = vehicleResponse.data as ServiceVehicleRow[];

        const formattedMilitaryData: Military[] = militaryData.map(item => ({
          name: item.nome_de_guerra || '',
          function: item.funcao || '',
          gbm: item.GBM || '',
          vtr: item.viatura || '',
          date: parse(item.data || '', 'yyyy-MM-dd', new Date()),
          shiftDuration: '24',
        }));

        const formattedVehicleData: Vehicle[] = vehicleData.map(item => ({
          gbm: item.gbm || '',
          vtr: item.vtr || '',
          status: item.status || '',
          description: item.alteracao || '',
        }));

        setServiceMilitaryList(formattedMilitaryData);
        setServiceVehicleList(formattedVehicleData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do relatório",
        });
      }
    };

    fetchData();
  }, [selectedDate, selectedGBM, toast]);

  return {
    serviceMilitaryList,
    setServiceMilitaryList,
    serviceVehicleList,
    setServiceVehicleList,
  };
};