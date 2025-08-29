
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface ContractHeaderProps {
  onGoBack: () => void;
  contractStatus: string;
  onSendReport: () => void;
  onRenewContract: () => void;
}

const ContractHeader: React.FC<ContractHeaderProps> = ({
  onGoBack,
  contractStatus,
  onSendReport,
  onRenewContract
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
          Back to Contracts
        </Button>
      </div>

      {/* Contract Details Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contract Details</h1>
        <div className="flex gap-2">
          {contractStatus === 'Renewal pending' ? (
            <>
              <Button 
                variant="outline" 
                className="border-bcs-green text-bcs-green hover:bg-bcs-green/10"
                onClick={onSendReport}
              >
                Send Report
              </Button>
              <Button 
                type="button"
                className="bg-bcs-green hover:bg-bcs-green/90 text-white"
                onClick={onRenewContract}
              >
                Renew Contract
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              className="border-bcs-green text-bcs-green hover:bg-bcs-green/10"
              onClick={onSendReport}
            >
              Send Report
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ContractHeader;
