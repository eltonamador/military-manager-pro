import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface TableHeaderProps {
  field: string;
  label: string;
  onSort: (field: string) => void;
}

export const TableHeader = ({ field, label, onSort }: TableHeaderProps) => {
  return (
    <TableHead className="font-semibold py-2">
      <Button
        variant="ghost"
        onClick={() => onSort(field)}
        className="hover:bg-military-red/10 text-gray-700 font-medium w-full justify-start p-1"
      >
        {label}
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    </TableHead>
  );
};