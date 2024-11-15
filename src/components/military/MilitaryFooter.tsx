import React from 'react';
import { Button } from "@/components/ui/button";

interface MilitaryFooterProps {
  onFinish: () => void;
  disabled: boolean;
}

const MilitaryFooter = ({ onFinish, disabled }: MilitaryFooterProps) => {
  return (
    <footer className="mt-6">
      <Button
        onClick={onFinish}
        className="w-full bg-military-orange hover:bg-military-red transition-colors text-white font-bold text-lg py-6"
        disabled={disabled}
      >
        Finalizar Militares
      </Button>
    </footer>
  );
};

export default MilitaryFooter;