// mock-lis/server.js
// 模擬大華醫事檢驗所內部 LIS（Laboratory Information System）
// 真實情境下這是診所既有系統，我們無法直接串接，先用假資料模擬「查得到/查不到/被鎖定」三種情境

const express = require('express');
const app = express();
app.use(express.json());

// 假的 LIS 患者資料庫（真實情境下這些資料絕不會離開診所內網）
const MOCK_LIS_PATIENTS = [
  { lis_patient_id: 'DH-2024-00123', phone: '0912345678', dob: '1990-05-20', name: '王小明' },
  { lis_patient_id: 'DH-2024-00456', phone: '0922333444', dob: '1985-11-02', name: '陳美華' },
  { lis_patient_id: 'DH-2025-00789', phone: '0933555666', dob: '2001-01-15', name: '林大同' },
];

// 簡易防暴力破解：同一支手機號碼連續核對失敗 5 次後鎖定 60 秒
const FAILED_ATTEMPTS = new Map(); // phone -> { count, lockedUntil }
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000;

app.post('/lis/verify-patient', (req, res) => {
  const { phone, dob } = req.body || {};

  if (!phone || !dob) {
    return res.status(400).json({ matched: false, message: '缺少必要欄位 phone 或 dob' });
  }

  const record = FAILED_ATTEMPTS.get(phone);
  const now = Date.now();
  if (record && record.lockedUntil && now < record.lockedUntil) {
    const waitSec = Math.ceil((record.lockedUntil - now) / 1000);
    return res.status(429).json({
      matched: false,
      message: `核對失敗次數過多，請於 ${waitSec} 秒後再試`,
    });
  }

  const patient = MOCK_LIS_PATIENTS.find(p => p.phone === phone && p.dob === dob);

  if (patient) {
    FAILED_ATTEMPTS.delete(phone); // 成功後重置失敗計數
    return res.json({
      matched: true,
      lisPatientId: patient.lis_patient_id,
    });
  }

  // 核對失敗，累計次數
  const prevCount = record ? record.count : 0;
  const newCount = prevCount + 1;
  if (newCount >= MAX_ATTEMPTS) {
    FAILED_ATTEMPTS.set(phone, { count: 0, lockedUntil: now + LOCKOUT_MS });
  } else {
    FAILED_ATTEMPTS.set(phone, { count: newCount, lockedUntil: 0 });
  }

  return res.json({
    matched: false,
    message: '查無對應之患者資料，請確認留存電話與生日。',
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - newCount),
  });
});

const PORT = process.env.MOCK_LIS_PORT || 4001;
if (require.main === module) {
  app.listen(PORT, () => console.log(`[mock-lis] listening on :${PORT}`));
}

module.exports = app;
