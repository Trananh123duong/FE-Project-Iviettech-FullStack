import { createSlice } from '@reduxjs/toolkit'
import { getVipStatus, checkoutVip } from '../thunks/vip.thunk'

const initialState = {
  vipStatus: { data: {}, status: 'idle', error: null },     // { isVip, vip_started_at, vip_expires_at, now }
  checkoutData: { status: 'idle', error: null, last: null } // { message, plan, duration_days }
}

const vipSlice = createSlice({
  name: 'vip',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getVipStatus
      .addCase(getVipStatus.pending, (state) => {
        state.vipStatus.status = 'loading'
        state.vipStatus.error = null
      })
      .addCase(getVipStatus.fulfilled, (state, action) => {
        state.vipStatus.status = 'succeeded'
        state.vipStatus.data = action.payload || {}
      })
      .addCase(getVipStatus.rejected, (state, action) => {
        state.vipStatus.status = 'failed'
        state.vipStatus.error = action.payload || action.error?.message
      })

      // checkoutVip
      .addCase(checkoutVip.pending, (state) => {
        state.checkoutData.status = 'loading'
        state.checkoutData.error = null
      })
      .addCase(checkoutVip.fulfilled, (state, action) => {
        state.checkoutData.status = 'succeeded'
        state.checkoutData.last = action.payload || null
      })
      .addCase(checkoutVip.rejected, (state, action) => {
        state.checkoutData.status = 'failed'
        state.checkoutData.error = action.payload || action.error?.message
      })
  }
})

export default vipSlice.reducer
