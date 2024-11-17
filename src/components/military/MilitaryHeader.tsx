import React from 'react';

const MilitaryHeader = () => {
  return (
    <div className="bg-military-orange p-4 rounded-lg mb-6">
      <div className="bg-white rounded-lg p-4 mb-2">
        <h1 className="text-2xl font-bold text-military-red">
          Recebimento de
          <span className="text-military-orange ml-2">
            Militares
          </span>
        </h1>
      </div>
    </div>
  );
};

export default MilitaryHeader;