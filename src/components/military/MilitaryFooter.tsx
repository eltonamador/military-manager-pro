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
        className="w-full bg-military-red hover:bg-military-orange transition-colors text-white font-bold text-lg py-6"
        disabled={disabled}
      >
        Finalizar Militares
      </Button>
    </footer>
  );
};

export default MilitaryFooter;