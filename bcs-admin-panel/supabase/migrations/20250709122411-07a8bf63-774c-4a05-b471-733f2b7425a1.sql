
-- Create billing and payment tables for cashier portal
-- Create tenant bills table
CREATE TABLE public.tenant_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  bill_type TEXT NOT NULL CHECK (bill_type IN ('monthly_due', 'utilities', 'electricity', 'water', 'maintenance')),
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payment history table
CREATE TABLE public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  bill_id UUID REFERENCES public.tenant_bills(id),
  amount_paid DECIMAL(10,2) NOT NULL,
  amount_due DECIMAL(10,2) NOT NULL,
  change_amount DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'bank', 'card', 'wireless')),
  receipt_number TEXT NOT NULL UNIQUE,
  teller_id UUID REFERENCES public.profiles(id),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

-- Update tenant_bills updated_at trigger
CREATE TRIGGER update_tenant_bills_updated_at
  BEFORE UPDATE ON public.tenant_bills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.tenant_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant_bills
CREATE POLICY "Allow cashier and admin to view all bills"
  ON public.tenant_bills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'cashier')
      AND status = 'active'
    )
  );

CREATE POLICY "Allow cashier and admin to manage bills"
  ON public.tenant_bills FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'cashier')
      AND status = 'active'
    )
  );

-- RLS Policies for payment_history
CREATE POLICY "Allow cashier and admin to view payment history"
  ON public.payment_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'cashier')
      AND status = 'active'
    )
  );

CREATE POLICY "Allow cashier and admin to create payments"
  ON public.payment_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'cashier')
      AND status = 'active'
    )
  );

-- Insert sample tenant bills data with new tenant ID format
INSERT INTO public.tenant_bills (tenant_id, bill_type, amount, due_date, status) VALUES
  ('T2025070901', 'monthly_due', 500.00, '2025-07-15', 'unpaid'),
  ('T2025070901', 'electricity', 120.50, '2025-07-20', 'unpaid'),
  ('T2025070901', 'water', 75.00, '2025-07-20', 'unpaid'),
  ('T2025070902', 'monthly_due', 500.00, '2025-07-15', 'unpaid'),
  ('T2025070902', 'utilities', 95.25, '2025-07-18', 'unpaid'),
  ('T2025070903', 'monthly_due', 500.00, '2025-07-15', 'overdue'),
  ('T2025070903', 'electricity', 180.75, '2025-07-10', 'overdue'),
  ('T2025070904', 'monthly_due', 500.00, '2025-07-15', 'unpaid'),
  ('T2025070905', 'monthly_due', 500.00, '2025-07-15', 'unpaid'),
  ('T2025070905', 'maintenance', 250.00, '2025-07-25', 'unpaid');
