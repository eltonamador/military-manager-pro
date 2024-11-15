import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, Edit } from "lucide-react";
import { MilitaryReport } from "./report/MilitaryReport";
import { VehicleReport } from "./report/VehicleReport";

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
  onEdit,
  onSend,
  selectedDate,
}: FinalReportProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Relatório Final</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <MilitaryReport selectedDate={selectedDate} />
          <VehicleReport selectedDate={selectedDate} />
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