
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AssistantLayout from "../components/layouts/AssistantLayout";
import { supabase } from "@/integrations/supabase/client";
import { ApplicantRow } from '@/types/database';
import { ChevronLeft, FileText } from "lucide-react";

type ApplicantData = ApplicantRow;

const ContractLeasePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applicantData, setApplicantData] = useState<ApplicantData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('applicants')
          .select('*')
          .eq('id', id)
          .single()
          .returns<ApplicantData>() as any;
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setApplicantData(data);
        }
      } catch (error) {
        console.error('Error fetching applicant details:', error);
        toast({
          title: "Error",
          description: "Failed to load applicant details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplicantData();
  }, [id, toast]);

  const handleGoBack = () => {
    navigate(`/assistant-admin/accounts/${id}`);
  };

  const handleSendContract = () => {
    toast({
      title: "Contract Sent",
      description: `Lease contract has been sent to ${applicantData?.first_name} ${applicantData?.last_name}`,
    });
    navigate('/assistant-admin/accounts');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <AssistantLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading contract template...</p>
        </div>
      </AssistantLayout>
    );
  }

  if (!applicantData) {
    return (
      <AssistantLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Applicant not found</p>
          <Button 
            variant="default" 
            className="ml-4 bg-bcs-green hover:bg-bcs-green/90"
            onClick={handleGoBack}
          >
            Back to Applicant Details
          </Button>
        </div>
      </AssistantLayout>
    );
  }

  return (
    <AssistantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={handleGoBack} 
              className="flex items-center text-gray-600 hover:text-bcs-green"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Applicant Details
            </Button>
          </div>
          <Button 
            className="bg-bcs-green hover:bg-bcs-green/90 text-white"
            onClick={handleSendContract}
          >
            <FileText className="mr-2 h-4 w-4" />
            Send Contract
          </Button>
        </div>

        <h1 className="text-2xl font-bold">Lease Contract</h1>

        {/* Contract Template */}
        <Card>
          <CardContent className="p-8">
            <div className="max-w-4xl mx-auto space-y-6 text-sm leading-relaxed">
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold uppercase">Lease Contract Agreement</h2>
                <p className="text-gray-600">Barangay Covered Court Terminal</p>
              </div>

              {/* Contract Body */}
              <div className="space-y-4">
                <p>
                  This Lease Contract Agreement is entered into on <strong>{getCurrentDate()}</strong> between:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div>
                    <h3 className="font-semibold mb-2">LESSOR:</h3>
                    <p>Barangay Covered Court Terminal<br />
                    [Address]<br />
                    [City, Province]</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">LESSEE:</h3>
                    <p><strong>{applicantData.first_name} {applicantData.middle_name} {applicantData.last_name}</strong><br />
                    {applicantData.street_address}<br />
                    {applicantData.barangay}, {applicantData.city}, {applicantData.province}</p>
                  </div>
                </div>

                <h3 className="font-semibold text-base mt-6">TERMS AND CONDITIONS:</h3>

                <div className="space-y-3">
                  <div>
                    <strong>1. PREMISES:</strong> The Lessor agrees to lease to the Lessee a stall space within the Barangay Covered Court Terminal for the operation of <strong>{applicantData.business_name}</strong> ({applicantData.business_type}).
                  </div>

                  <div>
                    <strong>2. TERM:</strong> This lease shall commence on the date of signing and shall continue for a period of one (1) year, renewable upon mutual agreement of both parties.
                  </div>

                  <div>
                    <strong>3. RENTAL:</strong> The monthly rental fee shall be determined based on the assigned stall location and size, payable on or before the 15th day of each month.
                  </div>

                  <div>
                    <strong>4. USE OF PREMISES:</strong> The leased premises shall be used solely for the business operation as specified in the application and shall not be used for any illegal activities.
                  </div>

                  <div>
                    <strong>5. MAINTENANCE:</strong> The Lessee shall maintain the cleanliness and orderliness of the leased premises and surrounding areas.
                  </div>

                  <div>
                    <strong>6. COMPLIANCE:</strong> The Lessee must maintain all required permits and licenses including but not limited to Business Permit, BCS Clearance, and other regulatory requirements.
                  </div>

                  <div>
                    <strong>7. TERMINATION:</strong> This contract may be terminated by either party with a 30-day written notice or immediately for violation of any terms herein.
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <p>
                    By signing below, both parties acknowledge that they have read, understood, and agree to be bound by the terms and conditions of this lease contract.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div className="space-y-4">
                      <div className="border-b border-gray-400 pb-1">
                        <p className="text-center text-xs text-gray-500 mb-8">LESSOR SIGNATURE</p>
                      </div>
                      <div>
                        <p className="font-semibold">BARANGAY COVERED COURT TERMINAL</p>
                        <p className="text-sm text-gray-600">By: _________________________</p>
                        <p className="text-sm text-gray-600">Name & Title</p>
                        <p className="text-sm text-gray-600">Date: _________________</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border-b border-gray-400 pb-1">
                        <p className="text-center text-xs text-gray-500 mb-8">LESSEE SIGNATURE</p>
                      </div>
                      <div>
                        <p className="font-semibold">{applicantData.first_name?.toUpperCase()} {applicantData.middle_name?.toUpperCase()} {applicantData.last_name?.toUpperCase()}</p>
                        <p className="text-sm text-gray-600">Signature: _________________________</p>
                        <p className="text-sm text-gray-600">Date: _________________</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AssistantLayout>
  );
};

export default ContractLeasePage;
