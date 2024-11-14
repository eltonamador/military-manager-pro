import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VehicleReport {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
}

const VehicleReceiving = () => {
  const [selectedVTR, setSelectedVTR] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reports, setReports] = useState<VehicleReport[]>([]);
  const { toast } = useToast();

  const vtrOptions = {
    "1º GBM": ["VTR-01", "VTR-02"],
    "2º GBM": ["VTR-03", "VTR-04"],
    "GAPH": ["VTR-05", "VTR-06"],
    "GMAF": ["VTR-07", "VTR-08"],
    "5º GBM": ["VTR-09", "VTR-10"],
    "MCPB": ["VTR-11", "VTR-12"],
  };

  const handleFinishVTR = () => {
    if (!selectedVTR || !status) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newReport = {
      gbm: Object.entries(vtrOptions).find(([_, vtrs]) =>
        vtrs.includes(selectedVTR)
      )?.[0] || "",
      vtr: selectedVTR,
      status,
      description,
    };

    setReports([...reports, newReport]);
    setShowConfirmDialog(true);
  };

  const handleNewVTR = () => {
    setSelectedVTR("");
    setStatus("");
    setDescription("");
    setShowConfirmDialog(false);
    toast({
      title: "Sucesso",
      description: "Pronto para receber nova VTR",
    });
  };

  const handleFinishAll = () => {
    setShowConfirmDialog(false);
    setShowReportDialog(true);
  };

  return (
    <div className="min-h-screen military-gradient flex flex-col p-4 animate-fadeIn">
      <header className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h1 className="text-2xl font-bold text-military-red">
          Recebimento de VTRs
        </h1>
      </header>

      <main className="flex-grow bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <Label htmlFor="vtr">VTR</Label>
            <Select onValueChange={setSelectedVTR} value={selectedVTR}>
              <SelectTrigger id="vtr">
                <SelectValue placeholder="Selecione a VTR" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(vtrOptions)
                  .flat()
                  .map((vtr) => (
                    <SelectItem key={vtr} value={vtr}>
                      {vtr}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={setStatus} value={status}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operante">Operante</SelectItem>
                <SelectItem value="parcialmente">Parcialmente Operante</SelectItem>
                <SelectItem value="inoperante">Inoperante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descrição das Alterações</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as alterações ou observações sobre a VTR"
              className="min-h-[100px]"
            />
          </div>
        </div>

        <Button
          onClick={handleFinishVTR}
          className="w-full bg-military-orange hover:bg-military-red transition-colors"
        >
          Finalizar VTR
        </Button>
      </main>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja Receber outra VTR?</AlertDialogTitle>
            <AlertDialogDescription>
              Escolha se deseja continuar recebendo VTRs ou finalizar o processo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleFinishAll}>Não</AlertDialogCancel>
            <AlertDialogAction onClick={handleNewVTR}>Sim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Relatório Final</DialogTitle>
            <DialogDescription>
              Resumo dos recebimentos de VTRs realizados
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">GBM</th>
                  <th className="text-left p-2">VTR</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{report.gbm}</td>
                    <td className="p-2">{report.vtr}</td>
                    <td className="p-2">{report.status}</td>
                    <td className="p-2">{report.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowReportDialog(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleReceiving;