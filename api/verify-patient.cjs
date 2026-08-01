// api/verify-patient.js
// 對應提案中的「Vercel API 中台」，App 呼叫這一層，這一層再去問 LIS（正式環境會是診所內網或加密通道）
// 目前先指向本機的 mock-lis 伺服器，方便驗證整條流程

const LIS_ENDPOINT = process.env.LIS_ENDPOINT || 'http://localhost:4001/lis/verify-patient';

async function verifyPatient(phone, dob) {
  const response = await fetch(LIS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, dob }),
  });

  const result = await response.json();
  return { httpStatus: response.status, ...result };
}

module.exports = { verifyPatient };
