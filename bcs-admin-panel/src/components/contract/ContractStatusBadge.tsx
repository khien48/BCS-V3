
import React from 'react';

interface ContractStatusBadgeProps {
  status: string;
  contractStatus: string;
}

const ContractStatusBadge: React.FC<ContractStatusBadgeProps> = ({ status, contractStatus }) => {
  return (
    <div className="flex justify-end gap-2">
      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
        status === 'Active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {status}
      </span>
      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
        contractStatus === 'Renewed' 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-amber-100 text-amber-800'
      }`}>
        {contractStatus}
      </span>
    </div>
  );
};

export default ContractStatusBadge;
