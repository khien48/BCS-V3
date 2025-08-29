
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface RejectionReasonCardProps {
  status: string;
  rejectionReason?: string;
}

const RejectionReasonCard: React.FC<RejectionReasonCardProps> = ({
  status,
  rejectionReason
}) => {
  if (status !== 'Rejected' || !rejectionReason) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Rejection Reason</h2>
        <p className="text-gray-700">{rejectionReason}</p>
      </CardContent>
    </Card>
  );
};

export default RejectionReasonCard;
