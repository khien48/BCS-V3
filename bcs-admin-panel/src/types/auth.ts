
export type UserRole = 'admin' | 'cashier' | 'terminal_staff';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface Profile {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  username: string;
  contact_number: string;
  role: UserRole;
  status: UserStatus;
  profile_picture?: string;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}
