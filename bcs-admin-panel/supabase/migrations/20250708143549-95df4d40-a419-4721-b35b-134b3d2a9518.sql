
-- Add status and rejection_reason fields to registered_buses table
ALTER TABLE public.registered_buses 
ADD COLUMN status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
ADD COLUMN rejection_reason text;

-- Create an index for better performance on status queries
CREATE INDEX idx_registered_buses_status ON public.registered_buses(status);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_registered_buses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_registered_buses_updated_at
    BEFORE UPDATE ON public.registered_buses
    FOR EACH ROW
    EXECUTE FUNCTION update_registered_buses_updated_at();
