
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AssistantLayout from "../components/layouts/AssistantLayout";
import { supabase } from "@/integrations/supabase/client";
import { ApplicantRow } from '@/types/database';
import ApplicantHeader from '../components/applicant/ApplicantHeader';
import StatusBadge from '../components/applicant/StatusBadge';
import AssistantDocumentsCard from '../components/applicant/AssistantDocumentsCard';
import ApproveDialog from '../components/applicant/ApproveDialog';
import RejectDialog from '../components/applicant/RejectDialog';

type ApplicantData = ApplicantRow;

const ApplicantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
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
    navigate('/assistant-admin/accounts');
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const handleApproveClick = () => {
    setIsApproveDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('applicants')
        .update({ status: 'Approved' })
        .eq('id', id)
        .returns<ApplicantData>() as any;
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Application Approved",
        description: `You have approved ${applicantData?.first_name} ${applicantData?.last_name}'s application.`
      });
      
      setIsApproveDialogOpen(false);
      // Navigate to contract lease page instead of accounts list
      navigate(`/assistant-admin/contracts/lease/${id}`);
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: "Error",
        description: "Failed to approve the application",
        variant: "destructive"
      });
    }
  };

  const handleSubmitRejection = async () => {
    if (!rejectionReason.trim() || !id) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('applicants')
        .update({ 
          status: 'Rejected',
          rejection_reason: rejectionReason 
        })
        .eq('id', id)
        .returns<ApplicantData>() as any;
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Application Rejected",
        description: `You have rejected ${applicantData?.first_name} ${applicantData?.last_name}'s application.`
      });
      
      setIsRejectModalOpen(false);
      navigate('/assistant-admin/accounts');
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error",
        description: "Failed to reject the application",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <AssistantLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading applicant details...</p>
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
            Back to Applicants
          </Button>
        </div>
      </AssistantLayout>
    );
  }

  return (
    <AssistantLayout>
      <div className="space-y-6">
        <ApplicantHeader
          onGoBack={handleGoBack}
          applicantStatus={applicantData.status}
          onReject={handleReject}
          onApprove={handleApproveClick}
        />

        <StatusBadge status={applicantData.status} />

        <AssistantDocumentsCard applicantData={applicantData} />
      </div>

      <RejectDialog
        isOpen={isRejectModalOpen}
        onOpenChange={setIsRejectModalOpen}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onSubmit={handleSubmitRejection}
      />

      <ApproveDialog
        isOpen={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        onConfirm={handleConfirmApprove}
        applicantName={`${applicantData?.first_name} ${applicantData?.last_name}`}
      />
    </AssistantLayout>
  );
};

export default ApplicantDetails;
