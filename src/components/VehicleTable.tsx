import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
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
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

type SortField = 'gbm' | 'vtr' | 'status' | 'description' | 'date';
type SortOrder = 'asc' | 'desc';

const VehicleTable = ({ vehicleList, onEdit, onDelete }: VehicleTableProps) => {
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
      className="hover:bg-military-orange/10 text-gray-700 font-medium"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="rounded-xl border border-military-orange/20 shadow-sm">
      <Table>
        <TableHeader className="bg-gradient-to-r from-military-orange/5 to-military-red/5">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">
              <SortButton field="gbm" label="GBM" />
            </TableHead>
            <TableHead className="font-semibold">
              <SortButton field="vtr" label="VTR" />
            </TableHead>
            <TableHead className="font-semibold">
              <SortButton field="status" label="Status" />
            </TableHead>
            <TableHead className="font-semibold">
              <SortButton field="description" label="Descrição" />
            </TableHead>
            <TableHead className="font-semibold">
              <SortButton field="date" label="Data" />
            </TableHead>
            <TableHead className="text-right font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedList.map((vehicle, index) => (
            <TableRow 
              key={index}
              className="hover:bg-military-orange/5 transition-colors duration-200 even:bg-gray-50/50"
            >
              <TableCell className="font-medium">{vehicle.gbm}</TableCell>
              <TableCell>{vehicle.vtr}</TableCell>
              <TableCell>{vehicle.status}</TableCell>
              <TableCell>{vehicle.description}</TableCell>
              <TableCell>{vehicle.date ? format(vehicle.date, "dd/MM/yyyy", { locale: ptBR }) : ""}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  onClick={() => onEdit(index)}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-military-orange/10"
                >
                  <Pencil className="h-4 w-4 text-military-orange" />
                </Button>
                <Button
                  onClick={() => onDelete(index)}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-military-orange/10"
                >
                  <Trash2 className="h-4 w-4 text-military-orange" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {sortedList.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={6} 
                className="text-center text-gray-500 py-8 bg-gray-50/50"
              >
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