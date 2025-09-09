import { createSlice } from '@reduxjs/toolkit'
import { deleteHistoryItem, getMyHistory } from '../thunks/history.thunk'

export const historySlice = createSlice({
  name: 'history',
  initialState: {
    historyList: {
      data: [],     // mỗi item: { id, user_id, story_id, chapter_id, last_read_at, story, chapter }
      meta: {},     // { total, page, limit, totalPages }
      status: 'idle',
      error: null,
    },
    deleteAction: {
      status: 'idle',
      error: null,
      last: null,   // { id, message }
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== getMyHistory =====
      .addCase(getMyHistory.pending, (state) => {
        state.historyList.status = 'loading'
        state.historyList.error = null
      })
      .addCase(getMyHistory.fulfilled, (state, action) => {
        const { data, meta, more } = action.payload
        state.historyList.status = 'succeeded'
        state.historyList.data = more
          ? [...state.historyList.data, ...data]
          : data
        state.historyList.meta = meta
      })
      .addCase(getMyHistory.rejected, (state, action) => {
        state.historyList.status = 'failed'
        state.historyList.error = action.error.message
      })

      // ===== deleteHistoryItem =====
      .addCase(deleteHistoryItem.pending, (state) => {
        state.deleteAction.status = 'loading'
        state.deleteAction.error = null
      })
      .addCase(deleteHistoryItem.fulfilled, (state, action) => {
        state.deleteAction.status = 'succeeded'
        state.deleteAction.last = action.payload // { id, message }
        // Nếu muốn xoá ngay khỏi list (UI phản hồi tức thì), bỏ comment dòng dưới:
        // state.historyList.data = state.historyList.data.filter(item => item.id !== action.payload.id)
      })
      .addCase(deleteHistoryItem.rejected, (state, action) => {
        state.deleteAction.status = 'failed'
        state.deleteAction.error = action.error.message
      })
  },
})

export default historySlice.reducer
