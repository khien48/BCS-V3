
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ApproveDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  applicantName: string;
}

const ApproveDialog: React.FC<ApproveDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  applicantName
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Application</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve {applicantName}'s application? This will redirect you to the contract lease page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-bcs-green hover:bg-bcs-green/90"
          >
            Yes, Approve & Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApproveDialog;
