
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NewApplicantApproveDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  applicantName: string;
}

const NewApplicantApproveDialog: React.FC<NewApplicantApproveDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  applicantName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve Application</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve {applicantName}'s application? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewApplicantApproveDialog;
