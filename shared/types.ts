// ============================================
// 大華醫事檢驗所 - 共用型別定義
// ============================================

// --- 會員相關 ---

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
  patient_id: string;        // LIS 系統的病患編號
  referral_source_id?: string;
  created_at: string;
}

// --- 檢驗報告 ---

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
  name: string;              // 檢驗項目名稱
  value: number | string;    // 數值
  unit: string;              // 單位
  reference_min?: number;    // 參考值下限
  reference_max?: number;    // 參考值上限
  is_abnormal?: boolean;     // 是否異常
}

// --- 預約 ---

export interface Booking {
  id: string;
  patient_id: string;
  plan_id: string;
  referral_source_id?: string;
  appointment_date: string;  // YYYY-MM-DD
  appointment_time: string;  // HH:mm
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

// --- 訂單 ---

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

// --- 檢驗方案 ---

export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  referral_source_id?: string;
  is_active: boolean;
  created_at: string;
}

// --- 診所/通路 ---

export interface ReferralSource {
  id: string;
  name: string;
  type: 'clinic' | 'otc' | 'other';
  address?: string;
  phone?: string;
  is_active: boolean;
}

// --- 提醒 ---

export interface Reminder {
  id: string;
  patient_id: string;
  title: string;
  content?: string;
  remind_at: string;
  is_read: boolean;
  created_at: string;
}

// --- 每日紀錄 ---

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

// --- LIS 驗證 ---

export interface LISVerifyRequest {
  phone: string;
  birthDate: string;         // YYYY-MM-DD
}

export interface LISVerifyResponse {
  found: boolean;
  patientId?: string;
  name?: string;
  message?: string;
}

// --- API 回應 ---

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
