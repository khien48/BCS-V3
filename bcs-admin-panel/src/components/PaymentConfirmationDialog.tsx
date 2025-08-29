
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (receiptNumber: string) => Promise<void>;
  busDetails: {
    plate_number: string;
    bus_name: string;
    total_fee: number;
  } | null;
  tellerName: string;
}

const PaymentConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  busDetails,
  tellerName
}: PaymentConfirmationDialogProps) => {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  
  // Generate receipt number on dialog open
  useEffect(() => {
    if (open) {
      generateReceiptNumber();
    }
  }, [open]);

  // Generate receipt number with format: dayYear + 10 random digits
  const generateReceiptNumber = () => {
    const today = new Date();
    const day = today.getDate().toString();
    const year = today.getFullYear().toString().slice(-4);
    const prefix = day + year; // e.g., "72025" for the 7th day of 2025
    
    // Generate 10 random digits
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    const newReceiptNumber = prefix + randomDigits;
    setReceiptNumber(newReceiptNumber);
  };

  const handleSubmit = async () => {
    if (!receiptNumber.trim()) {
      toast({
        title: "Receipt Number Required",
        description: "Please enter a receipt number to continue.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(receiptNumber);
      setReceiptNumber(''); // Reset form after successful submission
    } catch (error) {
      console.error("Payment confirmation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Confirmation</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teller" className="text-right">
              Teller Name
            </Label>
            <Input id="teller" value={tellerName} className="col-span-3" readOnly disabled />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment-date" className="text-right">
              Payment Date
            </Label>
            <Input id="payment-date" value={currentDate} className="col-span-3" readOnly disabled />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="receipt-number" className="text-right">
              Receipt Number
            </Label>
            <Input 
              id="receipt-number" 
              value={receiptNumber} 
              onChange={(e) => setReceiptNumber(e.target.value)} 
              className="col-span-3"
              placeholder="Auto-generated receipt number"
              autoFocus
            />
          </div>

          {busDetails && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Bus Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">Bus:</span>
                <span>{busDetails.bus_name}</span>
                <span className="text-gray-500">Plate Number:</span>
                <span>{busDetails.plate_number}</span>
                <span className="text-gray-500">Total Fee:</span>
                <span className="font-medium text-bcs-green">₱{busDetails.total_fee}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-bcs-green hover:bg-bcs-green/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Processing</>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Confirm Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentConfirmationDialog;
