
export type UserRole = 
  | 'admin'
  | 'cashier'
  | 'terminal_staff'
  | 'assistant_admin'
  | 'terminal_operator';

export type UserStatus =
  | 'active'
  | 'inactive'
  | 'suspended';

export interface UserRegistrationData {
  email: string;
  password: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  username: string;
  contact_number: string;
  role: UserRole;
}

export interface UserProfile {
  id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  suffix?: string | null;
  username: string;
  contact_number: string;
  role: UserRole;
  status: UserStatus;
  profile_picture?: string | null;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
}
