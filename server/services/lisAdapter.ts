import mockLIS from '../mock-lis/server.js';

const provider = process.env.LIS_PROVIDER || 'mock';

export async function verifyPatient(phone: string, birthDate: string) {
  if (provider === 'mock') return mockLIS.verifyPatient(phone, birthDate);
  throw new Error('Real LIS not implemented');
}

export async function getPatientReports(patientId: string) {
  if (provider === 'mock') return mockLIS.getPatientReports(patientId);
  throw new Error('Real LIS not implemented');
}

export async function getPatientInfo(patientId: string) {
  if (provider === 'mock') return mockLIS.getPatientInfo(patientId);
  throw new Error('Real LIS not implemented');
}

export default { verifyPatient, getPatientReports, getPatientInfo };
