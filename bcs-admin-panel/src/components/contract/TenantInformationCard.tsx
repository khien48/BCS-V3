
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

interface TenantInformationCardProps {
  contractData: ContractData;
}

const TenantInformationCard: React.FC<TenantInformationCardProps> = ({
  contractData
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Tenant Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Full Name:</p>
            <p className="font-medium">{contractData.tenantName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact Number:</p>
            <p className="font-medium">{contractData.tenantContact || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email Address:</p>
            <p className="font-medium">{contractData.tenantEmail || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Business Type:</p>
            <p className="font-medium">{contractData.businessType || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantInformationCard;
