
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ApplicantRow } from '@/types/database';

interface PersonalInformationCardProps {
  applicantData: ApplicantRow;
  formatDate: (dateString: string) => string;
}

const PersonalInformationCard: React.FC<PersonalInformationCardProps> = ({
  applicantData,
  formatDate
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name:</p>
              <p className="font-medium">
                {`${applicantData.last_name}, ${applicantData.first_name}${applicantData.middle_name ? ` ${applicantData.middle_name.charAt(0)}.` : ''}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender:</p>
              <p className="font-medium">{applicantData.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Birthday:</p>
              <p className="font-medium">{formatDate(applicantData.birthdate)}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Contact:</p>
              <p className="font-medium">{applicantData.phone_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email:</p>
              <p className="font-medium">{applicantData.email_address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address:</p>
              <p className="font-medium">
                {`${applicantData.street_address}, ${applicantData.barangay}, ${applicantData.city}, ${applicantData.province}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ZIP/Postal:</p>
              <p className="font-medium">{applicantData.postal_code}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformationCard;
