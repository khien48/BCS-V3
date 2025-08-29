
-- Create the new_applicants table
CREATE TABLE public.new_applicants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  applicant_id text,
  stall_number text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  middle_name text NULL,
  gender text NOT NULL,
  birthdate date NOT NULL,
  street_address text NOT NULL,
  barangay text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  postal_code text NOT NULL,
  phone_number text NOT NULL,
  email_address text NOT NULL,
  business_name text NOT NULL,
  business_registration_number text NOT NULL,
  business_type text NOT NULL,
  application_date timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status text NOT NULL DEFAULT 'Pending',
  bcs_clearance boolean NOT NULL DEFAULT false,
  mayors_permit boolean NOT NULL DEFAULT false,
  dti_registration boolean NOT NULL DEFAULT false,
  drug_test boolean NOT NULL DEFAULT false,
  board_resolution boolean NOT NULL DEFAULT false,
  stall_photo boolean NOT NULL DEFAULT false,
  rejection_reason text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT new_applicants_pkey PRIMARY KEY (id),
  CONSTRAINT new_applicants_gender_check CHECK (
    gender = ANY (ARRAY['Male', 'Female', 'Prefer not to specify'])
  ),
  CONSTRAINT new_applicants_status_check CHECK (
    status = ANY (ARRAY['Pending', 'Under Review', 'Approved', 'Rejected'])
  )
);

-- Create an index for better performance on status queries
CREATE INDEX idx_new_applicants_status ON public.new_applicants(status);

-- Create an index for better performance on application_date sorting
CREATE INDEX idx_new_applicants_application_date ON public.new_applicants(application_date DESC);

-- Create an index for better performance on stall_number filtering
CREATE INDEX idx_new_applicants_stall_number ON public.new_applicants(stall_number);

-- Enable RLS (Row Level Security) - keeping it simple for now
ALTER TABLE public.new_applicants ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (can be refined later)
CREATE POLICY "Allow all operations on new_applicants" ON public.new_applicants
FOR ALL USING (true) WITH CHECK (true);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_new_applicants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_new_applicants_updated_at
    BEFORE UPDATE ON public.new_applicants
    FOR EACH ROW
    EXECUTE FUNCTION update_new_applicants_updated_at();
