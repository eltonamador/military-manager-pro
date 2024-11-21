import VehicleHeader from "@/components/vehicle/VehicleHeader";
import VehicleContainer from "@/components/vehicle/VehicleContainer";

const VehicleReceiving = () => {
  return (
    <div className="min-h-screen military-gradient flex flex-col p-2 sm:p-4 animate-fadeIn">
      <div className="container mx-auto space-y-4">
        <VehicleHeader />
        <h1 className="text-2xl font-bold text-white mb-4">Recebimento de VTRs</h1>
        <VehicleContainer />
      </div>
    </div>
  );
};

export default VehicleReceiving;