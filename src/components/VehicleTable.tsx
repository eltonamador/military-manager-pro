import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
  date: Date;
}

interface VehicleTableProps {
  vehicleList: Vehicle[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const VehicleTable = ({ vehicleList, onEdit, onDelete }: VehicleTableProps) => {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>GBM</TableHead>
            <TableHead>VTR</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicleList.map((vehicle, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{vehicle.gbm}</TableCell>
              <TableCell>{vehicle.vtr}</TableCell>
              <TableCell>{vehicle.status}</TableCell>
              <TableCell>{vehicle.description}</TableCell>
              <TableCell>{vehicle.date ? format(vehicle.date, "dd/MM/yyyy", { locale: ptBR }) : ""}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  onClick={() => onEdit(index)}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => onDelete(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {vehicleList.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Nenhuma VTR adicionada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleTable;