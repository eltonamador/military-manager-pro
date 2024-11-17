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
  vehicles: Vehicle[];
  onClose: () => void;
  onFinish: () => void;
}

const FinalReport = ({
  vehicles,
  onClose,
  onFinish,
}: FinalReportProps) => {
  const [serviceMilitaryList, setServiceMilitaryList] = useState<Military[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!vehicles.length || !vehicles[0].date) {
          setServiceMilitaryList([]);
          return;
        }

        const formattedDate = vehicles[0].date.toISOString().split('T')[0];

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
  }, [vehicles, toast]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto p-3 sm:p-6">
        <DialogHeader>
          <DialogTitle>Relatório Final</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Militares</h3>
            <div className="overflow-x-auto">
              <MilitaryTable militaryList={serviceMilitaryList} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">VTRs</h3>
            <div className="overflow-x-auto">
              <VehicleTable
                vehicleList={vehicles}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6">
          <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>
          <Button onClick={onFinish} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
            <Send className="mr-2 h-4 w-4" /> Enviar via WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinalReport;