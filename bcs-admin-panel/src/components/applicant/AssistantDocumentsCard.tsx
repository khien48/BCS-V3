
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ApplicantRow } from '@/types/database';

interface AssistantDocumentsCardProps {
  applicantData: ApplicantRow;
}

const AssistantDocumentsCard: React.FC<AssistantDocumentsCardProps> = ({ applicantData }) => {
  const documents = [
    { name: "BCS Clearance", value: applicantData.bcs_clearance },
    { name: "Mayor's Permit", value: applicantData.mayors_permit },
    { name: "DTI Registration", value: applicantData.dti_registration },
    { name: "Drug Test", value: applicantData.drug_test },
    { name: "Board Resolution", value: applicantData.board_resolution },
    { name: "Stall Photo", value: applicantData.stall_photo }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Uploaded Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
  );
};

export default AssistantDocumentsCard;
