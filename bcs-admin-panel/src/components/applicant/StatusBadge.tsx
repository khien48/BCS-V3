
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <div className="flex justify-end">
      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
        status === 'Approved' 
          ? 'bg-green-100 text-green-800' 
          : status === 'Rejected'
            ? 'bg-red-100 text-red-800'
            : status === 'Under Review'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-amber-100 text-amber-800'
      }`}>
        {status}
      </span>
    </div>
  );
};

export default StatusBadge;
