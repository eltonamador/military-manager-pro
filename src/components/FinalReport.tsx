import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MilitaryTable from "./MilitaryTable";
import VehicleTable from "./VehicleTable";
import { Send, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { getServiceMilitaryTableName, getServiceVTRTableName } from "@/utils/supabase-utils";

interface Military {
  name: string;
  function: string;
  gbm: string;
  vtr: string;
  date: Date;
  shiftDuration: string;
}

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
}

interface FinalReportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  militaryList: Military[];
  vehicleList: Vehicle[];
  onEdit: () => void;
  onSend: () => void;
  selectedDate: Date;
}

const FinalReport = ({
  open,
  onOpenChange,
  militaryList,
  vehicleList,
  onEdit,
  onSend,
  selectedDate,
}: FinalReportProps) => {
  const [serviceMilitaryList, setServiceMilitaryList] = useState<Military[]>([]);
  const [serviceVehicleList, setServiceVehicleList] = useState<Vehicle[]>([]);
  const { toast } = useToast();

  const handleEditMilitary = async (index: number) => {
    const military = serviceMilitaryList[index];
    toast({
      title: "Edição iniciada",
      description: `Editando militar: ${military.name}`,
    });
  };

  const handleDeleteMilitary = async (index: number) => {
    try {
      const military = serviceMilitaryList[index];
      const formattedDate = format(military.date, 'yyyy-MM-dd');
      const tableName = getServiceMilitaryTableName(military.gbm);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('nome_de_guerra', military.name)
        .eq('data', formattedDate);

      if (error) throw error;

      const updatedList = serviceMilitaryList.filter((_, i) => i !== index);
      setServiceMilitaryList(updatedList);
      
      toast({
        title: "Militar removido",
        description: "O militar foi removido com sucesso",
      });
    } catch (error) {
      console.error('Error deleting military:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover o militar",
      });
    }
  };

  const handleEditVehicle = async (index: number) => {
    const vehicle = serviceVehicleList[index];
    toast({
      title: "Edição iniciada",
      description: `Editando VTR: ${vehicle.vtr}`,
    });
  };

  const handleDeleteVehicle = async (index: number) => {
    try {
      const vehicle = serviceVehicleList[index];
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const tableName = getServiceVTRTableName(vehicle.gbm);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('vtr', vehicle.vtr)
        .eq('data', formattedDate);

      if (error) throw error;

      const updatedList = serviceVehicleList.filter((_, i) => i !== index);
      setServiceVehicleList(updatedList);
      
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
    const fetchData = async () => {
      try {
        if (!selectedDate) {
          setServiceMilitaryList([]);
          setServiceVehicleList([]);
          return;
        }

        const formattedDate = format(selectedDate, 'yyyy-MM-dd');

        // Fetch military data from all GBM tables
        const gbmList = ['1gbm', '2gbm', '5gbm', 'gaph', 'gmaf', 'mcpb'];
        const militaryData = [];
        const vehicleData = [];

        for (const gbm of gbmList) {
          const militaryTableName = `servico_militar_${gbm}`;
          const vtrTableName = `servico_vtrs_${gbm}`;

          const { data: mData, error: mError } = await supabase
            .from(militaryTableName)
            .select('*')
            .eq('data', formattedDate);

          if (mError) throw mError;
          if (mData) militaryData.push(...mData);

          const { data: vData, error: vError } = await supabase
            .from(vtrTableName)
            .select('*')
            .eq('data', formattedDate);

          if (vError) throw vError;
          if (vData) vehicleData.push(...vData);
        }

        const formattedMilitaryData: Military[] = militaryData.map(item => ({
          name: item.nome_de_guerra || '',
          function: item.funcao || '',
          gbm: item.GBM || '',
          vtr: item.viatura || '',
          date: new Date(item.data),
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

    if (open) {
      fetchData();
    }
  }, [open, selectedDate, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Relatório Final</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Militares</h3>
            <MilitaryTable
              militaryList={serviceMilitaryList}
              onEdit={handleEditMilitary}
              onDelete={handleDeleteMilitary}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">VTRs</h3>
            <VehicleTable
              vehicleList={serviceVehicleList}
              onEdit={handleEditVehicle}
              onDelete={handleDeleteVehicle}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <Button onClick={onEdit} variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>
          <Button onClick={onSend} className="bg-green-600 hover:bg-green-700">
            <Send className="mr-2 h-4 w-4" /> Enviar via WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinalReport;