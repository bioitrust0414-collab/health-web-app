/**
 * run-simulation.ts
 * 驗證 Mock LIS 的三種情境：
 * 1. 驗證成功
 * 2. 查無資料
 * 3. 防暴力破解鎖定
 */

import { verifyPatient, resetLock, getAllMockPatients } from '../server/mock-lis/server.js';

console.log('═══════════════════════════════════════');
console.log('  大華醫事檢驗所 - Mock LIS 模擬測試');
console.log('═══════════════════════════════════════\n');

const patients = getAllMockPatients();
console.log(`📋 模擬病患資料共 ${patients.length} 筆：`);
patients.forEach((p) => {
  console.log(`   - ${p.patientId}: ${p.name} / ${p.phone} / ${p.birthDate}`);
});
console.log('');

// ── 情境 1：驗證成功 ──
console.log('【情境 1】驗證成功');
console.log('─────────────────────────────────────');
const successCase = verifyPatient('0912345678', '1985-03-15');
console.log(`輸入: 手機=0912345678, 生日=1985-03-15`);
console.log(`結果: ${successCase.found ? '✅ 成功' : '❌ 失敗'}`);
if (successCase.found) {
  console.log(`病患編號: ${successCase.patientId}`);
  console.log(`姓名: ${successCase.name}`);
}
console.log('');

// ── 情境 2：查無資料 ──
console.log('【情境 2】查無資料');
console.log('─────────────────────────────────────');
const notFoundCase = verifyPatient('0999999999', '2000-01-01');
console.log(`輸入: 手機=0999999999, 生日=2000-01-01`);
console.log(`結果: ${notFoundCase.found ? '✅ 成功' : '❌ 失敗'}`);
console.log(`訊息: ${notFoundCase.message}`);
console.log('');

// ── 情境 3：防暴力破解鎖定 ──
console.log('【情境 3】防暴力破解鎖定');
console.log('─────────────────────────────────────');
const testPhone = '0911111111';
resetLock(testPhone); // 確保初始狀態乾淨

console.log(`測試手機: ${testPhone}`);
for (let i = 1; i <= 6; i++) {
  const result = verifyPatient(testPhone, '1990-01-01');
  console.log(`第 ${i} 次: ${result.found ? '成功' : '失敗'} - ${result.message}`);
}
console.log('');

// ── 情境 4：鎖定後嘗試 ──
console.log('【情境 4】鎖定後再次嘗試');
console.log('─────────────────────────────────────');
const lockedCase = verifyPatient(testPhone, '1990-01-01');
console.log(`輸入: 手機=${testPhone}`);
console.log(`結果: ${lockedCase.found ? '✅ 成功' : '❌ 失敗'}`);
console.log(`訊息: ${lockedCase.message}`);
console.log('');

// ── 情境 5：另一筆正確資料 ──
console.log('【情境 5】另一筆正確資料驗證');
console.log('─────────────────────────────────────');
const case2 = verifyPatient('0922333444', '1990-08-22');
console.log(`輸入: 手機=0922333444, 生日=1990-08-22`);
console.log(`結果: ${case2.found ? '✅ 成功' : '❌ 失敗'}`);
if (case2.found) {
  console.log(`病患編號: ${case2.patientId}`);
  console.log(`姓名: ${case2.name}`);
}
console.log('');

console.log('═══════════════════════════════════════');
console.log('  測試完成');
console.log('═══════════════════════════════════════');
