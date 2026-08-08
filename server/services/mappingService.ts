import { supabaseAdmin } from '../lib/supabaseClient.js';

export async function checkMapping(lineUserId: string) {
  const { data: profile } = await supabaseAdmin.from('profiles').select('id').eq('line_user_id', lineUserId).single();
  if (!profile) return { mapped: false };
  const { data: mapping } = await supabaseAdmin.from('patient_mappings').select('*').eq('profile_id', profile.id).single();
  if (!mapping) return { mapped: false, profileId: profile.id };
  return { mapped: true, profileId: profile.id, patientId: mapping.patient_id, mappingId: mapping.id };
}

export async function createMapping(lineUserId: string, patientId: string, referralSourceId?: string) {
  try {
    let { data: profile } = await supabaseAdmin.from('profiles').select('id').eq('line_user_id', lineUserId).single();
    if (!profile) {
      const { data: newProfile, error } = await supabaseAdmin.from('profiles').insert({ line_user_id: lineUserId }).select().single();
      if (error) throw new Error(error.message);
      profile = newProfile;
    }
    const { data: existing } = await supabaseAdmin.from('patient_mappings').select('id').eq('profile_id', profile.id).single();
    if (existing) return { success: true, profileId: profile.id };
    const { error } = await supabaseAdmin.from('patient_mappings').insert({ profile_id: profile.id, patient_id: patientId, referral_source_id: referralSourceId || null });
    if (error) throw new Error(error.message);
    return { success: true, profileId: profile.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, profileId: '', error: msg };
  }
}

const lockMap = new Map<string, { count: number; lockedUntil: number | null }>();
const MAX = 5;
const DURATION = 30 * 60 * 1000;

export function checkLock(id: string) {
  const r = lockMap.get(id);
  if (!r) return { locked: false, remainAttempts: MAX };
  if (r.lockedUntil && Date.now() < r.lockedUntil) {
    return { locked: true, message: `已鎖定，請 ${Math.ceil((r.lockedUntil - Date.now()) / 60000)} 分鐘後再試` };
  }
  if (r.lockedUntil && Date.now() >= r.lockedUntil) {
    lockMap.delete(id);
    return { locked: false, remainAttempts: MAX };
  }
  return { locked: false, remainAttempts: MAX - r.count };
}

export function recordFailedAttempt(id: string) {
  const r = lockMap.get(id) || { count: 0, lockedUntil: null };
  r.count++;
  if (r.count >= MAX) r.lockedUntil = Date.now() + DURATION;
  lockMap.set(id, r);
}

export default { checkMapping, createMapping, checkLock, recordFailedAttempt };
