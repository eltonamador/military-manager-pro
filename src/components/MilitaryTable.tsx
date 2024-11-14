import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Military {
  name: string;
  function: string;
}

interface MilitaryTableProps {
  militaryList: Military[];
}

const MilitaryTable = ({ militaryList }: MilitaryTableProps) => {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Função</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {militaryList.map((military, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{military.name}</TableCell>
              <TableCell>{military.function}</TableCell>
            </TableRow>
          ))}
          {militaryList.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-muted-foreground">
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