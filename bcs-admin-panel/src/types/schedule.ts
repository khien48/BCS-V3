
export interface Schedule {
  id: string;
  busNo: string;
  bodyNo: string;
  operator: string;
  bound: string;
  lane: string;
  time: string;
  timeType: 'AM' | 'PM';
  date?: Date;
  created_at?: string;
  updated_at?: string;
}

export interface DbSchedule {
  id: string;
  bus_no: string;
  body_no: string;
  operator: string;
  bound: string;
  lane: string;
  time: string;
  time_type: 'AM' | 'PM';
  date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DispatchHistory {
  id: string;
  schedule_id: string;
  bus_no: string;
  body_no: string;
  operator: string;
  bound: string;
  lane: string;
  time: string;
  time_type: 'AM' | 'PM';
  dispatched_at: string;
  dispatched_by: string;
}

export interface SleepBus {
  bus_id: string;
  bus_name: string;
  plate_number: string;
  route: string;
  daily_fee: number;
  days_parked?: number;
  total_fee?: number;
  date_time_parked: string;
  recorded_by?: string;
  last_updated?: string;
  payment_status?: string;
}

export interface PaidBus {
  payment_id: string;
  bus_id: string;
  payment_date: string;
  teller_id: string;
  receipt_number: string;
}
