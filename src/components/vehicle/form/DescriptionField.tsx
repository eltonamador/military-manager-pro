import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface DescriptionFieldProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

export const DescriptionField = ({ description, onDescriptionChange }: DescriptionFieldProps) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="show-description"
          checked={showDescription}
          onCheckedChange={(checked) => setShowDescription(checked as boolean)}
        />
        <Label htmlFor="show-description">Adicionar descrição das alterações</Label>
      </div>

      {showDescription && (
        <div>
          <Label htmlFor="description">Descrição das Alterações</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Descreva as alterações ou observações sobre a VTR"
            className="min-h-[100px]"
          />
        </div>
      )}
    </>
  );
};