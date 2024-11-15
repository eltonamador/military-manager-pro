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
}

const FinalReport = ({
  open,
  onOpenChange,
  militaryList,
  vehicleList,
  onEdit,
  onSend,
}: FinalReportProps) => {
  const [serviceMilitaryList, setServiceMilitaryList] = useState<Military[]>([]);
  const [serviceVehicleList, setServiceVehicleList] = useState<Vehicle[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch military service data
        const { data: militaryData, error: militaryError } = await supabase
          .from('servico_militar')
          .select('*')
          .order('created_at', { ascending: false });

        if (militaryError) throw militaryError;

        if (militaryData) {
          const formattedMilitaryData: Military[] = militaryData.map(item => ({
            name: item.nome_de_guerra || '',
            function: item.funcao || '',
            gbm: item.GBM || '',
            vtr: item.viatura || '',
            date: item.data ? new Date(item.data) : new Date(),
            shiftDuration: '24',
          }));
          setServiceMilitaryList(formattedMilitaryData);
        }

        // Fetch vehicle service data
        const { data: vehicleData, error: vehicleError } = await supabase
          .from('servico_vtrs')
          .select('*')
          .order('created_at', { ascending: false });

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
  }, [open, toast]);

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