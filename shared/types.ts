export interface Profile {
  id: string;
  line_user_id: string;
  email?: string;
  name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientMapping {
  id: string;
  profile_id: string;
  patient_id: string;
  referral_source_id?: string;
  created_at: string;
}

export interface Report {
  id: string;
  patient_id: string;
  plan_id?: string;
  report_date: string;
  items: ReportItem[];
  status: 'pending' | 'completed' | 'reviewed';
  created_at: string;
}

export interface ReportItem {
  name: string;
  value: number | string;
  unit: string;
  reference_min?: number;
  reference_max?: number;
  is_abnormal?: boolean;
}

export interface Booking {
  id: string;
  patient_id: string;
  plan_id: string;
  referral_source_id?: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface Order {
  id: string;
  patient_id: string;
  booking_id?: string;
  items: OrderItem[];
  total_amount: number;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_method?: 'line_pay' | 'credit_card' | 'cash';
  status: 'pending' | 'processing' | 'completed';
  created_at: string;
}

export interface OrderItem {
  plan_id: string;
  plan_name: string;
  price: number;
  quantity: number;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  referral_source_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface ReferralSource {
  id: string;
  name: string;
  type: 'clinic' | 'otc' | 'other';
  address?: string;
  phone?: string;
  is_active: boolean;
}

export interface Reminder {
  id: string;
  patient_id: string;
  title: string;
  content?: string;
  remind_at: string;
  is_read: boolean;
  created_at: string;
}

export interface DailyLog {
  id: string;
  patient_id: string;
  log_date: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  blood_sugar?: number;
  weight?: number;
  temperature?: number;
  notes?: string;
  created_at: string;
}

export interface LISVerifyRequest {
  phone: string;
  birthDate: string;
}

export interface LISVerifyResponse {
  found: boolean;
  patientId?: string;
  name?: string;
  message?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
