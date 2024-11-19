import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const TableActions = ({ onEdit, onDelete }: TableActionsProps) => {
  return (
    <div className="space-x-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="hover:bg-military-red/10 h-7 w-7"
      >
        <Edit className="h-4 w-4 text-military-red" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="hover:bg-military-red/10 h-7 w-7"
      >
        <Trash2 className="h-4 w-4 text-military-red" />
      </Button>
    </div>
  );
};