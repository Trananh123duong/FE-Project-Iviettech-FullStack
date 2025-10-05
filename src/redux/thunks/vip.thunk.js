import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@services/api'
import { getMyProfile } from './auth.thunk'

// GET /vip/status
export const getVipStatus = createAsyncThunk('vip/status', async () => {
  const { data } = await api.get('/vip/status')
  return data // { isVip, vip_started_at, vip_expires_at, now }
})

// POST /vip/checkout
// refetch profile/VIP sau khi mua, nhưng "fire-and-forget" (không await) để không làm fail checkout khi refetch lỗi.
export const checkoutVip = createAsyncThunk(
  'vip/checkout',
  async (payload, { dispatch }) => {
    const { data } = await api.post('/vip/checkout', payload || {})
    dispatch(getMyProfile())
    return data // { message, plan, duration_days }
  }
)
