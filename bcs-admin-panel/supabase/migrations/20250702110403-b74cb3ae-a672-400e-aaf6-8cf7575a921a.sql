
-- Add missing columns to bus_schedules table
ALTER TABLE public.bus_schedules 
ADD COLUMN IF NOT EXISTS body_no TEXT,
ADD COLUMN IF NOT EXISTS lane TEXT;

-- Create dispatch_history table
CREATE TABLE IF NOT EXISTS public.dispatch_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID NOT NULL,
  bus_no TEXT NOT NULL,
  body_no TEXT,
  operator TEXT NOT NULL,
  bound TEXT NOT NULL,
  lane TEXT,
  time TEXT NOT NULL,
  time_type TEXT NOT NULL CHECK (time_type IN ('AM', 'PM')),
  dispatched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dispatched_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add Row Level Security
ALTER TABLE public.dispatch_history ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing dispatch history
CREATE POLICY "Allow all users to view dispatch history" ON public.dispatch_history
  FOR SELECT USING (true);

-- Create policy for inserting dispatch history
CREATE POLICY "Allow authenticated users to insert dispatch history" ON public.dispatch_history
  FOR INSERT WITH CHECK (true);
