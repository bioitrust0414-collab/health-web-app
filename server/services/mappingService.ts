/**
 * Mapping Service
 * 負責 LINE userId ↔ LIS patientId 的勾稽邏輯
 */

import { supabaseAdmin } from '../lib/supabaseClient.js';

/**
 * 檢查 LINE userId 是否已勾稽
 */
export async function checkMapping(lineUserId: string): Promise<{
  mapped: boolean;
  profileId?: string;
  patientId?: string;
  mappingId?: string;
}> {
  // 1. 查 profile
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('line_user_id', lineUserId)
    .single();

  if (profileError || !profile) {
    return { mapped: false };
  }

  // 2. 查 patient_mappings
  const { data: mapping, error: mappingError } = await supabaseAdmin
    .from('patient_mappings')
    .select('*')
    .eq('profile_id', profile.id)
    .single();

  if (mappingError || !mapping) {
    return { mapped: false, profileId: profile.id };
  }

  return {
    mapped: true,
    profileId: profile.id,
    patientId: mapping.patient_id,
    mappingId: mapping.id,
  };
}

/**
 * 建立勾稽關係
 * 如果 profile 不存在會自動建立
 */
export async function createMapping(
  lineUserId: string,
  patientId: string,
  referralSourceId?: string
): Promise<{ success: boolean; profileId: string; error?: string }> {
  try {
    // 1. 取得或建立 profile
    let { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('line_user_id', lineUserId)
      .single();

    if (!profile) {
      const { data: newProfile, error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({ line_user_id: lineUserId })
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to create profile: ${insertError.message}`);
      }
      profile = newProfile;
    }

    // 2. 檢查是否已有勾稽
    const { data: existing } = await supabaseAdmin
      .from('patient_mappings')
      .select('id')
      .eq('profile_id', profile.id)
      .single();

    if (existing) {
      return { success: true, profileId: profile.id };
    }

    // 3. 建立 patient_mappings
    const { error: mappingError } = await supabaseAdmin
      .from('patient_mappings')
      .insert({
        profile_id: profile.id,
        patient_id: patientId,
        referral_source_id: referralSourceId || null,
      });

    if (mappingError) {
      throw new Error(`Failed to create mapping: ${mappingError.message}`);
    }

    return { success: true, profileId: profile.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Create mapping error:', message);
    return { success: false, profileId: '', error: message };
  }
}

/**
 * 根據 LINE userId 取得 patientId
 */
export async function getPatientIdByLineUserId(
  lineUserId: string
): Promise<string | null> {
  const result = await checkMapping(lineUserId);
  return result.patientId || null;
}

/**
 * 取得病患的檢驗報告（從 Supabase）
 */
export async function getReportsByPatientId(patientId: string) {
  const { data, error } = await supabaseAdmin
    .from('reports')
    .select('*')
    .eq('patient_id', patientId)
    .order('report_date', { ascending: false });

  if (error) {
    console.error('Get reports error:', error);
    return [];
  }

  return data || [];
}

/**
 * 防暴力破解：檢查鎖定狀態
 */
const lockMap = new Map<string, { count: number; lockedUntil: number | null }>();
const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 30 * 60 * 1000; // 30 分鐘

export function checkLock(identifier: string): {
  locked: boolean;
  remainAttempts?: number;
  message?: string;
} {
  const record = lockMap.get(identifier);
  if (!record) {
    return { locked: false, remainAttempts: MAX_ATTEMPTS };
  }

  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    const remainMin = Math.ceil((record.lockedUntil - Date.now()) / 60000);
    return {
      locked: true,
      message: `已鎖定，請 ${remainMin} 分鐘後再試`,
    };
  }

  // 鎖定已過期，重置
  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    lockMap.delete(identifier);
    return { locked: false, remainAttempts: MAX_ATTEMPTS };
  }

  return {
    locked: false,
    remainAttempts: MAX_ATTEMPTS - record.count,
  };
}

/**
 * 記錄失敗嘗試
 */
export function recordFailedAttempt(identifier: string): void {
  const record = lockMap.get(identifier) || { count: 0, lockedUntil: null };
  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCK_DURATION;
  }

  lockMap.set(identifier, record);
}

export default {
  checkMapping,
  createMapping,
  getPatientIdByLineUserId,
  getReportsByPatientId,
  checkLock,
  recordFailedAttempt,
};
