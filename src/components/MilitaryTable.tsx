import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
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
}

type SortField = 'name' | 'vtr' | 'function' | 'gbm' | 'date' | 'shiftDuration';
type SortOrder = 'asc' | 'desc';

const MilitaryTable = ({ militaryList }: MilitaryTableProps) => {
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
      className="hover:bg-red-50 text-gray-700 font-medium"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="rounded-lg border border-red-100">
      <Table>
        <TableHeader className="bg-gradient-to-r from-red-50 to-red-100">
          <TableRow>
            <TableHead>
              <SortButton field="name" label="Nome" />
            </TableHead>
            <TableHead>
              <SortButton field="vtr" label="VTR" />
            </TableHead>
            <TableHead>
              <SortButton field="function" label="Função" />
            </TableHead>
            <TableHead>
              <SortButton field="gbm" label="GBM" />
            </TableHead>
            <TableHead>
              <SortButton field="date" label="Data" />
            </TableHead>
            <TableHead>
              <SortButton field="shiftDuration" label="Jornada" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedList.map((military, index) => (
            <TableRow key={index} className="hover:bg-red-50/50">
              <TableCell className="font-medium">{military.name}</TableCell>
              <TableCell>{military.vtr}</TableCell>
              <TableCell>{military.function}</TableCell>
              <TableCell>{military.gbm}</TableCell>
              <TableCell>{format(military.date, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
              <TableCell>{military.shiftDuration}h</TableCell>
            </TableRow>
          ))}
          {sortedList.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
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