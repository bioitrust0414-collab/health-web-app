import { createServerFn } from '@tanstack/react-start'

export const fetchHealthData = createServerFn({ method: 'GET' })
  .handler(async () => {
    // 把你原本的 server 邏輯放這裡
    // 例如：資料庫查詢、呼叫外部 API 等
    return { status: 'ok', timestamp: new Date().toISOString() }
  })
