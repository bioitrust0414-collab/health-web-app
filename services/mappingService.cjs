// services/mappingService.js
// 對應提案中的 mappingService.ts，現在改用真實的 Supabase client 寫入 patient_mappings。

const { verifyPatient } = require('../api/verify-patient.cjs');
const { supabase } = require('../lib/supabaseClient.cjs');

async function saveMapping(userId, lisPatientId) {
  const { data, error } = await supabase
    .from('patient_mappings')
    .upsert(
      {
        profile_id: userId,
        lis_patient_id: lisPatientId,
        is_verified: true,
        linked_at: new Date().toISOString(),
      },
      { onConflict: 'profile_id,lis_patient_id' },
    )
    .select()
    .single();

  if (error) {
    throw new Error(`[mappingService] Supabase 寫入 patient_mappings 失敗: ${error.message}`);
  }

  return data;
}

async function verifyAndLinkPatient(userId, phone, dob) {
  const result = await verifyPatient(phone, dob);

  if (result.matched && result.lisPatientId) {
    const mapping = await saveMapping(userId, result.lisPatientId);
    return { success: true, lisPatientId: result.lisPatientId, mapping };
  }

  return {
    success: false,
    message: result.message,
    attemptsRemaining: result.attemptsRemaining,
    httpStatus: result.httpStatus,
  };
}

module.exports = { verifyAndLinkPatient, saveMapping };
