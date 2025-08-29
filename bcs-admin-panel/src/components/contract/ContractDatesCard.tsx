
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

interface ContractDatesCardProps {
  contractData: ContractData;
  formatDate: (dateString: string) => string;
}

const ContractDatesCard: React.FC<ContractDatesCardProps> = ({
  contractData,
  formatDate
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Contract Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Contract Start Date:</p>
            <p className="font-medium">{formatDate(contractData.startContract)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contract Due Date:</p>
            <p className="font-medium">{formatDate(contractData.contractDue)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Renewal Date:</p>
            <p className="font-medium">{contractData.lastRenewalDate ? formatDate(contractData.lastRenewalDate) : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status:</p>
            <p className={`font-medium ${
              contractData.status === 'Active' ? 'text-green-600' : 'text-red-600'
            }`}>
              {contractData.status}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractDatesCard;
