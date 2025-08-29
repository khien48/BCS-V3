
export interface Complaint {
  id: string;
  name: string;
  date: string;
  contact: string;
  subject: string;
  description: string;
  status: 'Pending' | 'Resolved';
  resolved_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
