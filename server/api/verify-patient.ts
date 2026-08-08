import { Router } from 'express';
import { verifyPatient } from '../services/lisAdapter.js';
import { checkMapping, createMapping, checkLock, recordFailedAttempt } from '../services/mappingService.js';

const router = Router();

router.post('/', async (req, res) => {
  const { phone, birthDate, lineUserId, referralSourceId } = req.body;
  if (!phone || !birthDate || !lineUserId) {
    return res.status(400).json({ success: false, error: '缺少必要參數' });
  }
  try {
    const existing = await checkMapping(lineUserId);
    if (existing.mapped) {
      return res.json({ success: true, message: '已驗證', patientId: existing.patientId });
    }
    const lockCheck = checkLock(phone);
    if (lockCheck.locked) {
      return res.status(429).json({ success: false, error: lockCheck.message });
    }
    const result = await verifyPatient(phone, birthDate);
    if (!result.found) {
      recordFailedAttempt(phone);
      return res.status(404).json({ success: false, error: result.message || '查無資料' });
    }
    const mapping = await createMapping(lineUserId, result.patientId!, referralSourceId);
    if (!mapping.success) {
      return res.status(500).json({ success: false, error: mapping.error || '建立勾稽失敗' });
    }
    return res.json({ success: true, message: '驗證成功', patientId: result.patientId, name: result.name });
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ success: false, error: '系統錯誤' });
  }
});

router.get('/check', async (req, res) => {
  const { lineUserId } = req.query;
  if (!lineUserId || typeof lineUserId !== 'string') {
    return res.status(400).json({ success: false, error: '缺少 lineUserId' });
  }
  try {
    const result = await checkMapping(lineUserId);
    return res.json({ success: true, mapped: result.mapped, patientId: result.patientId });
  } catch {
    return res.status(500).json({ success: false, error: '系統錯誤' });
  }
});

export default router;
