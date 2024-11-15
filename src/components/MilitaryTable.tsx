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
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const MilitaryTable = ({ militaryList, onEdit, onDelete }: MilitaryTableProps) => {
  const groupedMilitaries = militaryList.reduce((acc, military, index) => {
    const key = `${military.gbm}-${format(military.date, "dd/MM/yyyy")}`;
    if (!acc[key]) {
      acc[key] = {
        gbm: military.gbm,
        date: military.date,
        militaries: []
      };
    }
    acc[key].militaries.push({ ...military, originalIndex: index });
    return acc;
  }, {} as Record<string, { gbm: string; date: Date; militaries: (Military & { originalIndex: number })[] }>);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>VTR</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Jornada</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedMilitaries).map(([key, group]) => (
            <>
              <TableRow key={`header-${key}`} className="bg-muted/50">
                <TableCell colSpan={5} className="font-medium text-center">
                  {group.gbm} - Dia: {format(group.date, "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
              </TableRow>
              {group.militaries.map((military) => (
                <TableRow key={`military-${military.originalIndex}`}>
                  <TableCell>{military.name}</TableCell>
                  <TableCell>{military.vtr}</TableCell>
                  <TableCell>{military.function}</TableCell>
                  <TableCell>{military.shiftDuration}h</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      onClick={() => onEdit(military.originalIndex)}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => onDelete(military.originalIndex)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </>
          ))}
          {militaryList.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Nenhum militar adicionado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MilitaryTable;