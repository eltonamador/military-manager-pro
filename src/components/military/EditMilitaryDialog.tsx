import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Military } from "@/types/military";

interface EditMilitaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  military: Military | null;
  onSave: (updatedMilitary: Military) => void;
  gbmOptions: string[];
  vtrOptions: string[];
}

const militaryFunctionOptions = [
  "Condutor",
  "Condutor/Operador",
  "Adjunto do Oficial",
  "Resgateiro 1",
  "Resgateiro 2",
  "Socorrista",
  "Cmdt de GU",
  "Cmdt de 1º linha",
  "ajudante de 1º linha",
  "Cmdt de 2º linha",
  "ajudante de 2º linha"
];

const shiftDurationOptions = ["6", "8", "12", "24"];

export function EditMilitaryDialog({
  isOpen,
  onClose,
  military,
  onSave,
  gbmOptions,
  vtrOptions,
}: EditMilitaryDialogProps) {
  if (!military) return null;

  const handleSave = () => {
    onSave(military);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Militar</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias nos dados do militar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gbm" className="text-right">
              GBM
            </Label>
            <Select
              value={military.gbm}
              onValueChange={(value) => military.gbm = value}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o GBM" />
              </SelectTrigger>
              <SelectContent>
                {gbmOptions.map((gbm) => (
                  <SelectItem key={gbm} value={gbm}>
                    {gbm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vtr" className="text-right">
              VTR
            </Label>
            <Select
              value={military.vtr}
              onValueChange={(value) => military.vtr = value}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a VTR" />
              </SelectTrigger>
              <SelectContent>
                {vtrOptions.map((vtr) => (
                  <SelectItem key={vtr} value={vtr}>
                    {vtr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="function" className="text-right">
              Função
            </Label>
            <Select
              value={military.function}
              onValueChange={(value) => military.function = value}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a Função" />
              </SelectTrigger>
              <SelectContent>
                {militaryFunctionOptions.map((func) => (
                  <SelectItem key={func} value={func}>
                    {func}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shiftDuration" className="text-right">
              Jornada
            </Label>
            <Select
              value={military.shiftDuration}
              onValueChange={(value) => military.shiftDuration = value}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a Jornada" />
              </SelectTrigger>
              <SelectContent>
                {shiftDurationOptions.map((duration) => (
                  <SelectItem key={duration} value={duration}>
                    {duration} horas
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}