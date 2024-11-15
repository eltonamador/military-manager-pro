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
import { getMilitaryTableName, getVehicleTableName } from "@/utils/tableNames";

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
  date: Date;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedDate) {
          setServiceMilitaryList([]);
          setServiceVehicleList([]);
          return;
        }

        const formattedDate = selectedDate.toISOString().split('T')[0];

        // Fetch military service data from all GBM tables
        const militaryData = [];
        for (const gbm of ["1º GBM", "2º GBM", "MCPB", "5º GBM", "GAPH", "GMAF"]) {
          try {
            const tableName = getMilitaryTableName(gbm);
            const { data, error } = await supabase
              .from(tableName)
              .select('*')
              .eq('data', formattedDate);

            if (error) throw error;
            if (data) militaryData.push(...data);
          } catch (error) {
            console.error(`Error fetching military data for ${gbm}:`, error);
          }
        }

        const formattedMilitaryData: Military[] = militaryData.map(item => ({
          name: item.nome_de_guerra || '',
          function: item.funcao || '',
          gbm: item.GBM || '',
          vtr: item.viatura || '',
          date: item.data ? new Date(item.data) : new Date(),
          shiftDuration: '24',
        }));
        setServiceMilitaryList(formattedMilitaryData);

        // Fetch vehicle service data from all GBM tables
        const vehicleData = [];
        for (const gbm of ["1º GBM", "2º GBM", "MCPB", "5º GBM", "GAPH", "GMAF"]) {
          try {
            const tableName = getVehicleTableName(gbm);
            const { data, error } = await supabase
              .from(tableName)
              .select('*')
              .eq('data', formattedDate);

            if (error) throw error;
            if (data) vehicleData.push(...data);
          } catch (error) {
            console.error(`Error fetching vehicle data for ${gbm}:`, error);
          }
        }

        const formattedVehicleData: Vehicle[] = vehicleData.map(item => ({
          gbm: item.gbm || '',
          vtr: item.vtr || '',
          status: item.status || '',
          description: item.alteracao || '',
          date: item.data ? new Date(item.data) : new Date(),
        }));
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
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">VTRs</h3>
            <VehicleTable
              vehicleList={serviceVehicleList}
              onEdit={() => {}}
              onDelete={() => {}}
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