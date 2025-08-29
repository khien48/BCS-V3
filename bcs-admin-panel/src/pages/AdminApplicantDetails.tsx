
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "../components/layouts/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { UserCredential } from '../utils/auth';
import ApplicantHeader from '../components/applicant/ApplicantHeader';
import StatusBadge from '../components/applicant/StatusBadge';
import PersonalInformationCard from '../components/applicant/PersonalInformationCard';
import BusinessDetailsCard from '../components/applicant/BusinessDetailsCard';
import DocumentsCard from '../components/applicant/DocumentsCard';
import RejectionReasonCard from '../components/applicant/RejectionReasonCard';
import ApproveDialog from '../components/applicant/ApproveDialog';
import RejectDialog from '../components/applicant/RejectDialog';

interface AdminApplicantDetailsProps {
  user: UserCredential | null;
}

type AdminApplicantData = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  gender: "Male" | "Female" | "Prefer not to specify";
  birthdate: string;
  street_address: string;
  barangay: string;
  city: string;
  province: string;
  postal_code: string;
  phone_number: string;
  email_address: string;
  business_name: string;
  business_registration_number: string;
  business_type: string;
  application_date: string;
  status: "Pending" | "Under Review" | "Approved" | "Rejected";
  bcs_clearance: boolean;
  mayors_permit: boolean;
  dti_registration: boolean;
  drug_test: boolean;
  board_resolution: boolean;
  stall_photo: boolean;
  digital_contract_status: "Unsigned" | "Signed" | "Finalized";
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
};

const AdminApplicantDetails: React.FC<AdminApplicantDetailsProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [applicantData, setApplicantData] = useState<AdminApplicantData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('admin_applicants')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setApplicantData(data as AdminApplicantData);
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
    navigate('/admin/applicants');
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
        .from('admin_applicants')
        .update({ status: 'Approved' })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Application Approved",
        description: `You have approved ${applicantData?.first_name} ${applicantData?.last_name}'s application.`
      });
      
      setIsApproveDialogOpen(false);
      navigate('/admin/applicants');
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
        .from('admin_applicants')
        .update({ 
          status: 'Rejected',
          rejection_reason: rejectionReason 
        })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Application Rejected",
        description: `You have rejected ${applicantData?.first_name} ${applicantData?.last_name}'s application.`
      });
      
      setIsRejectModalOpen(false);
      navigate('/admin/applicants');
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error",
        description: "Failed to reject the application",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <AdminLayout user={user}>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading applicant details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!applicantData) {
    return (
      <AdminLayout user={user}>
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        <ApplicantHeader
          onGoBack={handleGoBack}
          applicantStatus={applicantData.status}
          onReject={handleReject}
          onApprove={handleApproveClick}
        />

        <StatusBadge status={applicantData.status} />

        <PersonalInformationCard 
          applicantData={applicantData}
          formatDate={formatDate}
        />

        <BusinessDetailsCard 
          applicantData={applicantData}
          formatDate={formatDate}
        />

        <DocumentsCard 
          applicantData={applicantData}
          formatDate={formatDate}
        />

        <RejectionReasonCard 
          status={applicantData.status}
          rejectionReason={applicantData.rejection_reason}
        />
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
    </AdminLayout>
  );
};

export default AdminApplicantDetails;
