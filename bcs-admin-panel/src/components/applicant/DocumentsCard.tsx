
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ApplicantRow } from '@/types/database';

interface DocumentsCardProps {
  applicantData: ApplicantRow;
  formatDate: (dateString: string) => string;
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({
  applicantData,
  formatDate
}) => {
  const documents = [
    { type: 'bcs_clearance', name: 'BCS Clearance', uploaded: applicantData.bcs_clearance },
    { type: 'mayors_permit', name: 'Mayor\'s Permits', uploaded: applicantData.mayors_permit },
    { type: 'dti_registration', name: 'DTI\'s / SEC Registration', uploaded: applicantData.dti_registration },
    { type: 'drug_test', name: 'Drug Test Result', uploaded: applicantData.drug_test },
    { type: 'board_resolution', name: 'Board Resolution', uploaded: applicantData.board_resolution },
    { type: 'stall_photo', name: 'Stall Photo', uploaded: applicantData.stall_photo }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc.type} className="flex justify-between items-center p-3 border rounded-md bg-white">
              <div>
                <p className="text-sm text-gray-500">{doc.name}:</p>
                <p className={`font-medium ${doc.uploaded ? "text-green-600" : "text-amber-500"}`}>
                  {doc.uploaded ? "Uploaded" : "Not uploaded"}
                </p>
              </div>
              {doc.uploaded && (
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

export default DocumentsCard;
