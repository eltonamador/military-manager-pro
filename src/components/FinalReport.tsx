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
import { format, parse } from "date-fns";
import { getServiceTableName, getVehicleTableName } from "@/utils/supabase-utils";

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
  selectedGBM?: string;
}

const FinalReport = ({
  open,
  onOpenChange,
  militaryList,
  vehicleList,
  onEdit,
  onSend,
  selectedDate,
  selectedGBM = "1gbm",
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
      const tableName = getServiceTableName(selectedGBM);
      
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
      const tableName = getVehicleTableName(selectedGBM);
      
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
        const militaryTableName = getServiceTableName(selectedGBM);
        const vehicleTableName = getVehicleTableName(selectedGBM);

        const { data: militaryData, error: militaryError } = await supabase
          .from(militaryTableName)
          .select('*')
          .eq('data', formattedDate);

        if (militaryError) throw militaryError;

        if (militaryData) {
          const formattedMilitaryData: Military[] = militaryData.map(item => ({
            name: item.nome_de_guerra || '',
            function: item.funcao || '',
            gbm: item.GBM || '',
            vtr: item.viatura || '',
            date: parse(item.data, 'yyyy-MM-dd', new Date()),
            shiftDuration: '24',
          }));
          setServiceMilitaryList(formattedMilitaryData);
        }

        const { data: vehicleData, error: vehicleError } = await supabase
          .from(vehicleTableName)
          .select('*')
          .eq('data', formattedDate);

        if (vehicleError) throw vehicleError;

        if (vehicleData) {
          const formattedVehicleData: Vehicle[] = vehicleData.map(item => ({
            gbm: item.gbm || '',
            vtr: item.vtr || '',
            status: item.status || '',
            description: item.alteracao || '',
          }));
          setServiceVehicleList(formattedVehicleData);
        }
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
  }, [open, selectedDate, selectedGBM, toast]);

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