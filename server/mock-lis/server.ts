interface MockPatient {
  patientId: string;
  name: string;
  phone: string;
  birthDate: string;
  reports: MockReport[];
}

interface MockReport {
  id: string;
  reportDate: string;
  planName: string;
  items: { name: string; value: number | string; unit: string; referenceMin: number; referenceMax: number }[];
}

const mockPatients: MockPatient[] = [
  {
    patientId: 'P001', name: '王小明', phone: '0912345678', birthDate: '1985-03-15',
    reports: [
      { id: 'R001', reportDate: '2026-07-20', planName: '成人健檢套組',
        items: [
          { name: '血壓收縮壓', value: 125, unit: 'mmHg', referenceMin: 90, referenceMax: 140 },
          { name: '空腹血糖', value: 95, unit: 'mg/dL', referenceMin: 70, referenceMax: 100 },
        ] },
    ],
  },
  {
    patientId: 'P002', name: '李大華', phone: '0922333444', birthDate: '1990-08-22',
    reports: [
      { id: 'R003', reportDate: '2026-06-01', planName: '血糖檢測',
        items: [
          { name: '空腹血糖', value: 110, unit: 'mg/dL', referenceMin: 70, referenceMax: 100 },
        ] },
    ],
  },
];

const lockMap = new Map<string, { failedCount: number; lockedUntil: number | null }>();
const MAX_FAILED = 5;
const LOCK_MS = 30 * 60 * 1000;

export function verifyPatient(phone: string, birthDate: string) {
  const lock = lockMap.get(phone);
  if (lock?.lockedUntil && Date.now() < lock.lockedUntil) {
    const remainMin = Math.ceil((lock.lockedUntil - Date.now()) / 60000);
    return { found: false, message: `帳號已鎖定，請 ${remainMin} 分鐘後再試` };
  }

  const patient = mockPatients.find((p) => p.phone === phone && p.birthDate === birthDate);
  if (patient) {
    lockMap.delete(phone);
    return { found: true, patientId: patient.patientId, name: patient.name };
  }

  const current = lockMap.get(phone) || { failedCount: 0, lockedUntil: null };
  current.failedCount++;
  if (current.failedCount >= MAX_FAILED) {
    current.lockedUntil = Date.now() + LOCK_MS;
    lockMap.set(phone, current);
    return { found: false, message: '連續驗證失敗 5 次，帳號已鎖定 30 分鐘' };
  }
  lockMap.set(phone, current);
  return { found: false, message: `查無資料，還剩 ${MAX_FAILED - current.failedCount} 次機會` };
}

export function getPatientReports(patientId: string) {
  return mockPatients.find((p) => p.patientId === patientId)?.reports || null;
}

export function getPatientInfo(patientId: string) {
  const patient = mockPatients.find((p) => p.patientId === patientId);
  if (!patient) return null;
  const { reports, ...info } = patient;
  return info;
}

export function resetLock(phone: string) { lockMap.delete(phone); }
export function getAllMockPatients() { return mockPatients; }

export default { verifyPatient, getPatientReports, getPatientInfo, resetLock, getAllMockPatients };
