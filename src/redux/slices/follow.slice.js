import { createSlice } from '@reduxjs/toolkit'
import { followStory, getMyFollows, unfollowStory } from '../thunks/follow.thunk'

export const followSlice = createSlice({
  name: 'follow',
  initialState: {
    followedStoryList: {
      data: [],     // danh sách stories (mỗi story có thể gồm chapters[0..2], user_follows.created_at,...)
      meta: {},     // { total, page, limit, totalPages }
      status: 'idle',
      error: null,
    },
    followAction: {
      status: 'idle',
      error: null,
      last: null,   // lưu kết quả gần nhất (optional: { storyId, is_followed, message })
    },
    unfollowAction: {
      status: 'idle',
      error: null,
      last: null,   // lưu kết quả gần nhất (optional)
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== getMyFollows =====
      .addCase(getMyFollows.pending, (state) => {
        state.followedStoryList.status = 'loading'
        state.followedStoryList.error = null
      })
      .addCase(getMyFollows.fulfilled, (state, action) => {
        const { data, meta, more } = action.payload
        state.followedStoryList.status = 'succeeded'
        state.followedStoryList.data = more
          ? [...state.followedStoryList.data, ...data]
          : data
        state.followedStoryList.meta = meta
      })
      .addCase(getMyFollows.rejected, (state, action) => {
        state.followedStoryList.status = 'failed'
        state.followedStoryList.error = action.error.message
      })

      // ===== followStory =====
      .addCase(followStory.pending, (state) => {
        state.followAction.status = 'loading'
        state.followAction.error = null
      })
      .addCase(followStory.fulfilled, (state, action) => {
        state.followAction.status = 'succeeded'
        state.followAction.last = action.payload // { storyId, is_followed: true, message }
        // Lưu ý: không tự động đẩy vào list; UI có thể: 
        // - gọi lại getMyFollows({ page: 1, more: false }) để refresh
        // - hoặc chèn tạm vào đầu list nếu cần
      })
      .addCase(followStory.rejected, (state, action) => {
        state.followAction.status = 'failed'
        state.followAction.error = action.error.message
      })

      // ===== unfollowStory =====
      .addCase(unfollowStory.pending, (state) => {
        state.unfollowAction.status = 'loading'
        state.unfollowAction.error = null
      })
      .addCase(unfollowStory.fulfilled, (state, action) => {
        state.unfollowAction.status = 'succeeded'
        state.unfollowAction.last = action.payload // { storyId, is_followed: false, message }
        // Có thể chọn lọc bỏ ra khỏi list tại đây nếu UI muốn phản hồi tức thì:
        // state.followedStoryList.data = state.followedStoryList.data.filter(s => s.id !== action.payload.storyId)
        // Nhưng để giữ style "UI quyết định", mình không tự động mutate list ở đây.
      })
      .addCase(unfollowStory.rejected, (state, action) => {
        state.unfollowAction.status = 'failed'
        state.unfollowAction.error = action.error.message
      })
  },
})

export default followSlice.reducer
