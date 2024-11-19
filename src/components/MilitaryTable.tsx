import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Button } from "./ui/button";

interface Military {
  name: string;
  function: string;
  gbm: string;
  vtr: string;
  date: Date;
  shiftDuration: string;
}

interface MilitaryTableProps {
  militaryList: Military[];
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}

type SortField = 'name' | 'vtr' | 'function' | 'gbm' | 'date' | 'shiftDuration';
type SortOrder = 'asc' | 'desc';

const MilitaryTable = ({ militaryList, onEdit, onDelete }: MilitaryTableProps) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedList = [...militaryList].sort((a, b) => {
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
      className="hover:bg-military-red/10 text-gray-700 font-medium w-full justify-start p-1"
    >
      {label}
      <ArrowUpDown className="ml-1 h-4 w-4" />
    </Button>
  );

  return (
    <div className="rounded-xl border border-military-red/20 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gradient-to-r from-military-red/10 to-military-orange/10">
          <TableRow className="hover:bg-transparent border-b border-military-red/20">
            <TableHead className="font-semibold w-[180px] py-2">
              <SortButton field="name" label="Nome" />
            </TableHead>
            <TableHead className="font-semibold w-[80px] py-2">
              <SortButton field="vtr" label="VTR" />
            </TableHead>
            <TableHead className="font-semibold w-[120px] py-2">
              <SortButton field="function" label="Função" />
            </TableHead>
            <TableHead className="font-semibold w-[80px] py-2">
              <SortButton field="gbm" label="GBM" />
            </TableHead>
            <TableHead className="font-semibold w-[100px] py-2">
              <SortButton field="date" label="Data" />
            </TableHead>
            <TableHead className="font-semibold w-[80px] py-2">
              <SortButton field="shiftDuration" label="Jornada" />
            </TableHead>
            {(onEdit || onDelete) && (
              <TableHead className="text-right font-semibold w-[80px] py-2">Ações</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedList.map((military, index) => (
            <TableRow 
              key={index} 
              className="hover:bg-military-red/5 transition-colors duration-200 even:bg-gray-100/80"
            >
              <TableCell className="font-medium py-1.5">{military.name}</TableCell>
              <TableCell className="text-center py-1.5">{military.vtr}</TableCell>
              <TableCell className="py-1.5">{military.function}</TableCell>
              <TableCell className="text-center py-1.5">{military.gbm}</TableCell>
              <TableCell className="py-1.5">{format(military.date, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
              <TableCell className="text-center py-1.5">{military.shiftDuration}h</TableCell>
              {(onEdit || onDelete) && (
                <TableCell className="text-right space-x-1 py-1.5">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(index)}
                      className="hover:bg-military-red/10 h-7 w-7"
                    >
                      <Edit className="h-4 w-4 text-military-red" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(index)}
                      className="hover:bg-military-red/10 h-7 w-7"
                    >
                      <Trash2 className="h-4 w-4 text-military-red" />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
          {sortedList.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={7} 
                className="text-center text-gray-500 py-6 bg-gray-50/50"
              >
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MilitaryTable;