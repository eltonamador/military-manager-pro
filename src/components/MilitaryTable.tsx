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

interface Military {
  name: string;
  function: string;
  gbm: string;
  vtr: string;
}

interface MilitaryTableProps {
  militaryList: Military[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const MilitaryTable = ({ militaryList, onEdit, onDelete }: MilitaryTableProps) => {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>GBM</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>VTR</TableHead>
            <TableHead>Função</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {militaryList.map((military, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{military.gbm}</TableCell>
              <TableCell>{military.name}</TableCell>
              <TableCell>{military.vtr}</TableCell>
              <TableCell>{military.function}</TableCell>
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