import { verifyPatient, resetLock, getAllMockPatients } from '../server/mock-lis/server.js';

console.log('=======================================');
console.log('  Mock LIS 模擬測試');
console.log('=======================================\n');

const patients = getAllMockPatients();
console.log(`模擬病患共 ${patients.length} 筆：`);
patients.forEach((p) => console.log(`  - ${p.patientId}: ${p.name} / ${p.phone} / ${p.birthDate}`));
console.log('');

console.log('【情境 1】驗證成功');
const s1 = verifyPatient('0912345678', '1985-03-15');
console.log(`結果: ${s1.found ? '成功' : '失敗'} ${s1.found ? `| ${s1.name} (${s1.patientId})` : ''}`);
console.log('');

console.log('【情境 2】查無資料');
const s2 = verifyPatient('0999999999', '2000-01-01');
console.log(`結果: ${s2.found ? '成功' : '失敗'} | ${s2.message}`);
console.log('');

console.log('【情境 3】防暴力破解');
const testPhone = '0911111111';
resetLock(testPhone);
for (let i = 1; i <= 6; i++) {
  const r = verifyPatient(testPhone, '1990-01-01');
  console.log(`第 ${i} 次: ${r.found ? '成功' : '失敗'} - ${r.message}`);
}
console.log('');

console.log('【情境 4】鎖定後再試');
const s4 = verifyPatient(testPhone, '1990-01-01');
console.log(`結果: ${s4.found ? '成功' : '失敗'} | ${s4.message}`);
console.log('');

console.log('=======================================');
console.log('  測試完成');
console.log('=======================================');
