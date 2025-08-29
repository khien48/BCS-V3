
export interface ApplicantRow {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  gender: 'Male' | 'Female' | 'Prefer not to specify';
  birthdate: string;
  street_address: string;
  barangay: string;
  city: string;
  province: string;
  postal_code: string;
  phone_number: string;
  email_address: string;
  business_name: string;
  business_registration_number: string;
  business_type: string;
  application_date: string;
  status: "Pending" | "Under Review" | "Approved" | "Rejected";
  digital_contract_status: "Unsigned" | "Signed" | "Finalized";
  bcs_clearance: boolean;
  mayors_permit: boolean;
  dti_registration: boolean;
  drug_test: boolean;
  board_resolution: boolean;
  stall_photo: boolean;
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
}

export interface PostgrestResponseSuccess<T> {
  data: T;
  error: null;
  count?: number;
  status: number;
  statusText: string;
}

export interface PostgrestResponseFailure {
  data: null;
  error: {
    message: string;
    details: string;
    hint: string;
    code: string;
  };
  count?: null;
  status: number;
  statusText: string;
}

export type PostgrestResponse<T> = PostgrestResponseSuccess<T> | PostgrestResponseFailure;

export interface BusScheduleRow {
  id: string;
  bus_no: string;
  operator: string;
  bound: string;
  time: string;
  time_type: 'AM' | 'PM';
  created_at: string;
  updated_at: string;
}

export interface ComplaintRow {
  id: string;
  name: string;
  date: string;
  contact: string;
  subject: string;
  description: string;
  status: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ContractStatus = "Active" | "Expired" | "Pending" | "Renewed";

export interface TenantRow {
  id: number;
  name: string;
  stallNo: string;
  status: "Active" | "Inactive";
  stallNoAssigned: string;
  contractStatus: ContractStatus;
}
