import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, CreditCard, FileText, DollarSign, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';

interface TenantBill {
  id: string;
  bill_type: string;
  amount: number;
  due_date: string;
  status: string;
}

interface TenantDetails {
  tenantId: string;
  name: string;
  stallNo?: string;
}

interface TenantPaymentConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (receiptNumber: string) => Promise<void>;
  tenantDetails: TenantDetails | null;
  selectedBills: TenantBill[];
  totalAmount: number;
  amountPaid: number;
  changeAmount: number;
  paymentMethod: string;
  tellerName: string;
}

const TenantPaymentConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  tenantDetails,
  selectedBills,
  totalAmount,
  amountPaid,
  changeAmount,
  paymentMethod,
  tellerName
}: TenantPaymentConfirmationDialogProps) => {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const currentTime = format(new Date(), 'HH:mm:ss');
  
  // Generate receipt number on dialog open
  useEffect(() => {
    if (open) {
      generateReceiptNumber();
    }
  }, [open]);

  // Generate receipt number with format: TNT + dayYear + 8 random digits
  const generateReceiptNumber = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear().toString().slice(-4);
    const prefix = "TNT" + day + year; // e.g., "TNT072025" for tenant payment on 7th day of 2025
    
    // Generate 8 random digits
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
    
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
      setReceiptNumber('');
    } catch (error) {
      console.error("Payment confirmation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-center bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            <CreditCard className="h-7 w-7 mr-3 text-green-600" />
            Payment Confirmation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Payment Summary Card */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-green-700 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-500" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tenant Information */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-green-200 shadow-sm">
                <div>
                  <Label className="text-sm text-green-600 flex items-center font-medium">
                    <Users className="h-4 w-4 mr-1" />
                    Tenant ID
                  </Label>
                  <p className="font-semibold text-green-800 mt-1">{tenantDetails?.tenantId}</p>
                </div>
                <div>
                  <Label className="text-sm text-green-600 font-medium">Tenant Name</Label>
                  <p className="font-semibold text-green-800 mt-1">{tenantDetails?.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-green-600 font-medium">Payment Method</Label>
                  <p className="font-semibold text-emerald-600 mt-1">{paymentMethod}</p>
                </div>
                <div>
                  <Label className="text-sm text-green-600 flex items-center font-medium">
                    <Calendar className="h-4 w-4 mr-1" />
                    Date & Time
                  </Label>
                  <p className="font-semibold text-green-800 mt-1">{currentDate} {currentTime}</p>
                </div>
              </div>

              {/* Bills Breakdown */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-green-700">Bills Being Paid:</Label>
                {selectedBills.map((bill) => (
                  <div key={bill.id} className="flex justify-between items-center p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <div className="font-medium text-green-800 capitalize flex items-center">
                        {bill.bill_type === 'monthly_due' ? (
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        ) : (
                          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                        )}
                        {bill.bill_type.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-green-600 mt-1">Due: {formatDate(bill.due_date)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-lg">₱{Number(bill.amount).toFixed(2)}</div>
                      <div className="text-xs text-green-500 capitalize bg-green-100 px-2 py-1 rounded-full">{bill.status}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Amount Summary */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-5 rounded-xl border border-emerald-200 shadow-inner">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Total Amount Due:</span>
                    <span className="font-bold text-green-800 text-lg">₱{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Amount Received:</span>
                    <span className="font-bold text-emerald-600 text-lg">₱{amountPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-emerald-200 pt-3">
                    <span className="text-green-800 font-bold">Change:</span>
                    <span className="font-bold text-green-600 bg-green-100 px-4 py-2 rounded-xl text-lg shadow-sm">
                      ₱{changeAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teller" className="text-sm font-medium text-green-700">
                Processed By
              </Label>
              <Input 
                id="teller" 
                value={tellerName} 
                className="mt-1 bg-white/80 border-green-300 text-green-800" 
                readOnly 
                disabled 
              />
            </div>
            
            <div>
              <Label htmlFor="receipt-number" className="text-sm font-medium text-green-700">
                Receipt Number
              </Label>
              <Input 
                id="receipt-number" 
                value={receiptNumber} 
                onChange={(e) => setReceiptNumber(e.target.value)} 
                className="mt-1 bg-white/80 border-green-300 focus:border-green-500 focus:ring-green-500 font-mono"
                placeholder="Auto-generated receipt number"
                autoFocus
              />
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between pt-6 border-t border-green-200">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
            className="border-green-300 text-green-700 hover:bg-green-50 px-6"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200 px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Processing Payment...</>
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

export default TenantPaymentConfirmationDialog;