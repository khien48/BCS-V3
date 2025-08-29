
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface ApplicantHeaderProps {
  onGoBack: () => void;
  applicantStatus: string;
  onReject: () => void;
  onApprove: () => void;
}

const ApplicantHeader: React.FC<ApplicantHeaderProps> = ({
  onGoBack,
  applicantStatus,
  onReject,
  onApprove
}) => {
  return (
    <>
      {/* Back button */}
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={onGoBack} 
          className="flex items-center text-gray-600 hover:text-bcs-green"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Applicants
        </Button>
      </div>

      {/* Applicant Details Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Applicant Details</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-bcs-green text-bcs-green hover:bg-bcs-green/10"
            onClick={onReject}
            disabled={applicantStatus !== 'Pending'}
          >
            Reject
          </Button>
          <Button 
            type="button"
            className="bg-bcs-green hover:bg-bcs-green/90 text-white"
            onClick={onApprove}
            disabled={applicantStatus !== 'Pending'}
          >
            Approve
          </Button>
        </div>
      </div>
    </>
  );
};

export default ApplicantHeader;
