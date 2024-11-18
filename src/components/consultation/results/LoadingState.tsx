import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="flex justify-center items-center p-12">
      <div className="space-y-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto" />
        <p className="text-gray-600">Carregando dados...</p>
      </div>
    </div>
  );
};