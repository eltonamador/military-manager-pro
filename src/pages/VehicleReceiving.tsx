import VehicleHeader from "@/components/vehicle/VehicleHeader";
import VehicleContainer from "@/components/vehicle/VehicleContainer";

const VehicleReceiving = () => {
  return (
    <div className="min-h-screen military-gradient flex flex-col p-2 sm:p-4 animate-fadeIn">
      <VehicleHeader />
      <VehicleContainer />
    </div>
  );
};

export default VehicleReceiving;