
import React from 'react';
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RejectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
  onSubmit: () => void;
}

const RejectDialog: React.FC<RejectDialogProps> = ({
  isOpen,
  onOpenChange,
  rejectionReason,
  onReasonChange,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg border border-gray-200 bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-700">
            Provide a Reason for Rejected Documents
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <Textarea 
            placeholder="Enter your reason for rejection here..." 
            className="min-h-[180px] resize-none border-gray-300 rounded-md"
            value={rejectionReason}
            onChange={(e) => onReasonChange(e.target.value)}
          />
          <div className="flex justify-start">
            <Button 
              onClick={onSubmit}
              className="bg-[#e4f2e7] hover:bg-[#d1e9d5] text-green-800 flex items-center gap-2"
            >
              <Send size={16} /> Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDialog;
