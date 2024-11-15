import { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import VehicleTable from "../VehicleTable";
import { getServiceVTRTableName } from "@/utils/supabase-utils";

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
}

interface VehicleReportProps {
  selectedDate: Date;
}

export const VehicleReport = ({ selectedDate }: VehicleReportProps) => {
  const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
  const { toast } = useToast();

  const handleEditVehicle = async (index: number) => {
    const vehicle = vehicleList[index];
    toast({
      title: "Edição iniciada",
      description: `Editando VTR: ${vehicle.vtr}`,
    });
  };

  const handleDeleteVehicle = async (index: number) => {
    try {
      const vehicle = vehicleList[index];
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const tableName = getServiceVTRTableName(vehicle.gbm);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('vtr', vehicle.vtr)
        .eq('data', formattedDate);

      if (error) throw error;

      const updatedList = vehicleList.filter((_, i) => i !== index);
      setVehicleList(updatedList);
      
      toast({
        title: "VTR removida",
        description: "A VTR foi removida com sucesso",
      });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover a VTR",
      });
    }
  };

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        if (!selectedDate) {
          setVehicleList([]);
          return;
        }

        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const gbmList = ['1gbm', '2gbm', '5gbm', 'gaph', 'gmaf', 'mcpb'];
        const vehicleData = [];

        for (const gbm of gbmList) {
          const tableName = getServiceVTRTableName(gbm);
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('data', formattedDate);

          if (error) throw error;
          if (data) vehicleData.push(...data);
        }

        const formattedData: Vehicle[] = vehicleData.map(item => ({
          gbm: item.gbm || '',
          vtr: item.vtr || '',
          status: item.status || '',
          description: item.alteracao || '',
        }));

        setVehicleList(formattedData);
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados das VTRs",
        });
      }
    };

    fetchVehicleData();
  }, [selectedDate, toast]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">VTRs</h3>
      <VehicleTable
        vehicleList={vehicleList}
        onEdit={handleEditVehicle}
        onDelete={handleDeleteVehicle}
      />
    </div>
  );
};