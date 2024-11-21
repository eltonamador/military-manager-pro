import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { SortField } from "./types";

interface SortButtonProps {
  field: SortField;
  label: string;
  onSort: (field: SortField) => void;
}

export const SortButton = ({ field, label, onSort }: SortButtonProps) => (
  <Button
    variant="ghost"
    onClick={() => onSort(field)}
    className="hover:bg-military-orange/10 text-gray-700 font-medium w-full justify-start p-1"
  >
    {label}
    <ArrowUpDown className="ml-1 h-4 w-4" />
  </Button>
);