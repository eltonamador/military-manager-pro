import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface FinishOperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FinishOperationDialog = ({
  open,
  onOpenChange,
}: FinishOperationDialogProps) => {
  const navigate = useNavigate();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bom Serviço!</AlertDialogTitle>
          <AlertDialogDescription>
            Agradecemos pelo seu trabalho. Tenha um excelente serviço!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => {
            onOpenChange(false);
            navigate("/login");
          }}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};