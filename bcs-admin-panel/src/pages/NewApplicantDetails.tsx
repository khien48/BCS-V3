
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowLeft, Eye } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import AssistantLayout from "../components/layouts/AssistantLayout";
import { supabase } from "@/integrations/supabase/client";

interface NewApplicantData {
  id: string;
  applicant_id: string | null;
  stall_number: string | null;
  first_name: string;
  last_name: string;
  business_name: string;
  status: string;
  bcs_clearance: boolean;
  mayors_permit: boolean;
  dti_registration: boolean;
  drug_test: boolean;
  board_resolution: boolean;
  stall_photo: boolean;
  application_date: string;
  rejection_reason: string | null;
}

const NewApplicantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applicantData, setApplicantData] = useState<NewApplicantData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('new_applicants')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setApplicantData(data);
        }
      } catch (error) {
        console.error('Error fetching new applicant details:', error);
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
    navigate('/assistant-admin/new-applicants');
  };

  const documents = [
    { name: "BCS Clearance", value: applicantData?.bcs_clearance },
    { name: "Mayor's Permit", value: applicantData?.mayors_permit },
    { name: "DTI Registration", value: applicantData?.dti_registration },
    { name: "Drug Test", value: applicantData?.drug_test },
    { name: "Board Resolution", value: applicantData?.board_resolution },
    { name: "Stall Photo", value: applicantData?.stall_photo }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Pending': 'bg-amber-100 text-amber-800',
      'Under Review': 'bg-blue-100 text-blue-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
            Back to New Applicants
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
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to New Applicants
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {applicantData.first_name} {applicantData.last_name}
              </h1>
              <p className="text-gray-600">{applicantData.business_name}</p>
            </div>
          </div>
          {getStatusBadge(applicantData.status)}
        </div>

        {/* Applicant Info */}
        <Card>
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Applicant ID</p>
              <p className="font-medium">{applicantData.applicant_id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Stall Number</p>
              <p className="font-medium">{applicantData.stall_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Application Date</p>
              <p className="font-medium">{formatDate(applicantData.application_date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{applicantData.status}</p>
            </div>
            {applicantData.rejection_reason && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Rejection Reason</p>
                <p className="font-medium text-red-600">{applicantData.rejection_reason}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Uploaded Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{doc.name}</span>
                    <div className="flex items-center gap-2">
                      {doc.value ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Uploaded
                          </Badge>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            Missing
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  {doc.value && (
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="rounded-full hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 text-bcs-green" />
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>{doc.name}</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 mx-auto max-w-md">
                          <div className="aspect-[4/3] rounded-md bg-gray-100 flex items-center justify-center">
                            <img 
                              src="/lovable-uploads/c783ea26-96fe-4d20-bf04-a197fec00cf4.png" 
                              alt={doc.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-500">Document Type: {doc.name}</p>
                            <p className="text-sm text-gray-500">Applicant: {applicantData.first_name} {applicantData.last_name}</p>
                            <p className="text-sm text-gray-500">Upload Date: {formatDate(applicantData.application_date)}</p>
                          </div>
                        </div>
                        <DrawerFooter>
                          <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AssistantLayout>
  );
};

export default NewApplicantDetails;
