
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ApplicantRow } from '@/types/database';

interface BusinessDetailsCardProps {
  applicantData: ApplicantRow;
  formatDate: (dateString: string) => string;
}

const BusinessDetailsCard: React.FC<BusinessDetailsCardProps> = ({
  applicantData,
  formatDate
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Business Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Business Name:</p>
            <p className="font-medium">{applicantData.business_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Registration Number:</p>
            <p className="font-medium">{applicantData.business_registration_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type:</p>
            <p className="font-medium">{applicantData.business_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Application Date:</p>
            <p className="font-medium">{formatDate(applicantData.application_date)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessDetailsCard;
