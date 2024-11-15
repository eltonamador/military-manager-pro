import { useState } from "react";
import MilitarySearch from "./military/MilitarySearch";

interface MilitaryFormProps {
  onMilitaryChange: (value: string) => void;
  selectedMilitary: string;
}

const MilitaryForm = ({ onMilitaryChange, selectedMilitary }: MilitaryFormProps) => {
  return (
    <div>
      <MilitarySearch
        selectedMilitary={selectedMilitary}
        onSelect={onMilitaryChange}
      />
    </div>
  );
};

export default MilitaryForm;
