
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NewApplicantRejectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (rejectionReason: string) => void;
  applicantName: string;
}

const NewApplicantRejectDialog: React.FC<NewApplicantRejectDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  applicantName
}) => {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleConfirm = () => {
    if (rejectionReason.trim()) {
      onConfirm(rejectionReason);
      setRejectionReason('');
    }
  };

  const handleCancel = () => {
    setRejectionReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Application</DialogTitle>
          <DialogDescription>
            You are about to reject {applicantName}'s application. Please provide a reason for rejection.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please enter the reason for rejecting this application..."
              className="mt-2"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!rejectionReason.trim()}
          >
            Reject Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewApplicantRejectDialog;
