
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ContractData {
  id: number;
  stallNo: string;
  tenantName: string;
  startContract: string;
  contractDue: string;
  status: 'Active' | 'Expired';
  contractStatus: 'Renewed' | 'Renewal pending';
  tenantContact?: string;
  tenantEmail?: string;
  businessType?: string;
  monthlyRent?: number;
  lastRenewalDate?: string;
}

interface ContractInformationCardProps {
  contractData: ContractData;
  formatDate: (dateString: string) => string;
}

const ContractInformationCard: React.FC<ContractInformationCardProps> = ({
  contractData,
  formatDate
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Contract Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Stall Number:</p>
            <p className="font-medium">{contractData.stallNo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tenant Name:</p>
            <p className="font-medium">{contractData.tenantName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Business Type:</p>
            <p className="font-medium">{contractData.businessType || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Rent:</p>
            <p className="font-medium">₱{contractData.monthlyRent?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractInformationCard;
