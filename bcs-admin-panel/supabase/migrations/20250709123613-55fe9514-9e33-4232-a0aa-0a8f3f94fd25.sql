
-- Fix infinite recursion in RLS policies by creating a security definer function
-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Allow cashier and admin to view all bills" ON public.tenant_bills;
DROP POLICY IF EXISTS "Allow cashier and admin to manage bills" ON public.tenant_bills;
DROP POLICY IF EXISTS "Allow cashier and admin to view payment history" ON public.payment_history;
DROP POLICY IF EXISTS "Allow cashier and admin to create payments" ON public.payment_history;

-- Create new policies using the security definer function
CREATE POLICY "Allow cashier and admin to view all bills"
  ON public.tenant_bills FOR SELECT
  USING (public.get_current_user_role() IN ('admin', 'cashier'));

CREATE POLICY "Allow cashier and admin to manage bills"
  ON public.tenant_bills FOR ALL
  USING (public.get_current_user_role() IN ('admin', 'cashier'));

CREATE POLICY "Allow cashier and admin to view payment history"
  ON public.payment_history FOR SELECT
  USING (public.get_current_user_role() IN ('admin', 'cashier'));

CREATE POLICY "Allow cashier and admin to create payments"
  ON public.payment_history FOR INSERT
  WITH CHECK (public.get_current_user_role() IN ('admin', 'cashier'));
