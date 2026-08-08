/**
 * /api/verify-patient
 * 手機+生日驗證 → LIS 查詢 → 建立勾稽
 */

import { Router } from 'express';
import { verifyPatient } from '../services/lisAdapter.js';
import {
  checkMapping,
  createMapping,
  checkLock,
  recordFailedAttempt,
} from '../services/mappingService.js';

const router = Router();

router.post('/', async (req, res) => {
  const { phone, birthDate, lineUserId, referralSourceId } = req.body;

  // 參數檢查
  if (!phone || !birthDate || !lineUserId) {
    return res.status(400).json({
      success: false,
      error: '缺少必要參數：phone, birthDate, lineUserId',
    });
  }

  try {
    // 1. 檢查是否已勾稽
    const existing = await checkMapping(lineUserId);
    if (existing.mapped) {
      return res.json({
        success: true,
        message: '已經完成身分驗證',
        patientId: existing.patientId,
      });
    }

    // 2. 防暴力破解
    const lockCheck = checkLock(phone);
    if (lockCheck.locked) {
      return res.status(429).json({
        success: false,
        error: lockCheck.message,
      });
    }

    // 3. LIS 驗證
    const result = await verifyPatient(phone, birthDate);

    if (!result.found) {
      recordFailedAttempt(phone);
      return res.status(404).json({
        success: false,
        error: result.message || '查無資料',
      });
    }

    // 4. 建立勾稽
    const mapping = await createMapping(
      lineUserId,
      result.patientId!,
      referralSourceId
    );

    if (!mapping.success) {
      return res.status(500).json({
        success: false,
        error: mapping.error || '建立勾稽失敗',
      });
    }

    // 5. 成功回應
    return res.json({
      success: true,
      message: '驗證成功',
      patientId: result.patientId,
      name: result.name,
    });
  } catch (err) {
    console.error('Verify patient API error:', err);
    return res.status(500).json({
      success: false,
      error: '系統錯誤，請稍後再試',
    });
  }
});

/**
 * GET /api/verify-patient/check
 * 檢查 LINE userId 是否已勾稽
 */
router.get('/check', async (req, res) => {
  const { lineUserId } = req.query;

  if (!lineUserId || typeof lineUserId !== 'string') {
    return res.status(400).json({
      success: false,
      error: '缺少 lineUserId',
    });
  }

  try {
    const result = await checkMapping(lineUserId);
    return res.json({
      success: true,
      mapped: result.mapped,
      patientId: result.patientId,
    });
  } catch (err) {
    console.error('Check mapping error:', err);
    return res.status(500).json({
      success: false,
      error: '系統錯誤',
    });
  }
});

export default router;
