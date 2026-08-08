/**
 * Mock LIS 模擬伺服器
 * 模擬診所 LIS 系統的手機+生日核對
 * 含防暴力破解鎖定機制
 */

interface MockPatient {
  patientId: string;
  name: string;
  phone: string;
  birthDate: string; // YYYY-MM-DD
  reports: MockReport[];
}

interface MockReport {
  id: string;
  reportDate: string;
  planName: string;
  items: {
    name: string;
    value: number | string;
    unit: string;
    referenceMin: number;
    referenceMax: number;
  }[];
}

// 模擬資料庫
const mockPatients: MockPatient[] = [
  {
    patientId: 'P001',
    name: '王小明',
    phone: '0912345678',
    birthDate: '1985-03-15',
    reports: [
      {
        id: 'R001',
        reportDate: '2026-07-20',
        planName: '成人健檢套組',
        items: [
          { name: '血壓收縮壓', value: 125, unit: 'mmHg', referenceMin: 90, referenceMax: 140 },
          { name: '血壓舒張壓', value: 82, unit: 'mmHg', referenceMin: 60, referenceMax: 90 },
          { name: '空腹血糖', value: 95, unit: 'mg/dL', referenceMin: 70, referenceMax: 100 },
          { name: '總膽固醇', value: 210, unit: 'mg/dL', referenceMin: 0, referenceMax: 200 },
        ],
      },
      {
        id: 'R002',
        reportDate: '2026-01-10',
        planName: '肝功能檢查',
        items: [
          { name: 'GOT', value: 28, unit: 'U/L', referenceMin: 0, referenceMax: 40 },
          { name: 'GPT', value: 35, unit: 'U/L', referenceMin: 0, referenceMax: 40 },
          { name: '總膽紅素', value: 1.2, unit: 'mg/dL', referenceMin: 0.2, referenceMax: 1.2 },
        ],
      },
    ],
  },
  {
    patientId: 'P002',
    name: '李大華',
    phone: '0922333444',
    birthDate: '1990-08-22',
    reports: [
      {
        id: 'R003',
        reportDate: '2026-06-01',
        planName: '血糖檢測',
        items: [
          { name: '空腹血糖', value: 110, unit: 'mg/dL', referenceMin: 70, referenceMax: 100 },
          { name: '糖化血色素', value: 6.2, unit: '%', referenceMin: 4.0, referenceMax: 5.7 },
        ],
      },
    ],
  },
];

// 鎖定機制
interface LockRecord {
  failedCount: number;
  lockedUntil: number | null; // timestamp
}

const lockMap = new Map<string, LockRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 30 * 60 * 1000; // 30 分鐘

/**
 * 驗證病患身份
 */
export function verifyPatient(phone: string, birthDate: string): {
  found: boolean;
  patientId?: string;
  name?: string;
  message?: string;
} {
  // 檢查是否被鎖定
  const lock = lockMap.get(phone);
  if (lock && lock.lockedUntil && Date.now() < lock.lockedUntil) {
    const remainMin = Math.ceil((lock.lockedUntil - Date.now()) / 60000);
    return {
      found: false,
      message: `帳號已鎖定，請 ${remainMin} 分鐘後再試，或聯繫診所`,
    };
  }

  // 查詢病患
  const patient = mockPatients.find(
    (p) => p.phone === phone && p.birthDate === birthDate
  );

  if (patient) {
    // 成功 → 清除失敗紀
