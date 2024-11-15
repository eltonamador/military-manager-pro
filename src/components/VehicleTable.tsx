import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
  date: Date;
}

interface VehicleTableProps {
  vehicleList: Vehicle[];
}

type SortField = 'gbm' | 'vtr' | 'status' | 'description' | 'date';
type SortOrder = 'asc' | 'desc';

const VehicleTable = ({ vehicleList }: VehicleTableProps) => {
  const [sortField, setSortField] = useState<SortField>('gbm');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedList = [...vehicleList].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'date':
        return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
      default:
        return multiplier * (a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0);
    }
  });

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="hover:bg-transparent"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortButton field="gbm" label="GBM" />
            </TableHead>
            <TableHead>
              <SortButton field="vtr" label="VTR" />
            </TableHead>
            <TableHead>
              <SortButton field="status" label="Status" />
            </TableHead>
            <TableHead>
              <SortButton field="description" label="Descrição" />
            </TableHead>
            <TableHead>
              <SortButton field="date" label="Data" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedList.map((vehicle, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{vehicle.gbm}</TableCell>
              <TableCell>{vehicle.vtr}</TableCell>
              <TableCell>{vehicle.status}</TableCell>
              <TableCell>{vehicle.description}</TableCell>
              <TableCell>{vehicle.date ? format(vehicle.date, "dd/MM/yyyy", { locale: ptBR }) : ""}</TableCell>
            </TableRow>
          ))}
          {sortedList.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
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