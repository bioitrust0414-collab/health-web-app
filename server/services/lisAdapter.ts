/**
 * LIS Adapter 抽象層
 * 統一介面：未來換 LIS 廠商只需改這裡
 */

import mockLIS from '../mock-lis/server.js';

const LIS_PROVIDER = process.env.LIS_PROVIDER || 'mock';

/**
 * 驗證病患身份（手機 + 生日）
 */
export async function verifyPatient(
  phone: string,
  birthDate: string
): Promise<{
  found: boolean;
  patientId?: string;
  name?: string;
  message?: string;
}> {
  if (LIS_PROVIDER === 'mock') {
    return mockLIS.verifyPatient(phone, birthDate);
  }

  // TODO: 未來接真實 LIS
  // return await verifyWithRealLIS(phone, birthDate);
  throw new Error('Real LIS not implemented yet');
}

/**
 * 取得病患報告
 */
export async function getPatientReports(
  patientId: string
): Promise<ReturnType<typeof mockLIS.getPatientReports>> {
  if (LIS_PROVIDER === 'mock') {
    return mockLIS.getPatientReports(patientId);
  }

  // TODO: 未來接真實 LIS
  throw new Error('Real LIS not implemented yet');
}

/**
 * 取得病患基本資料
 */
export async function getPatientInfo(
  patientId: string
): Promise<ReturnType<typeof mockLIS.getPatientInfo>> {
  if (LIS_PROVIDER === 'mock') {
    return mockLIS.getPatientInfo(patientId);
  }

  // TODO: 未來接真實 LIS
  throw new Error('Real LIS not implemented yet');
}

export default {
  verifyPatient,
  getPatientReports,
  getPatientInfo,
};
