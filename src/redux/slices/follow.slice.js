import { createSlice } from '@reduxjs/toolkit'
import { followStory, getMyFollows, unfollowStory } from '../thunks/follow.thunk'

export const followSlice = createSlice({
  name: 'follow',
  initialState: {
    followedStoryList: {
      data: [],
      meta: {},
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
        const { data, meta } = action.payload
        state.followedStoryList.status = 'succeeded'
        state.followedStoryList.data = data
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
      })
      .addCase(unfollowStory.rejected, (state, action) => {
        state.unfollowAction.status = 'failed'
        state.unfollowAction.error = action.error.message
      })
  },
})

export default followSlice.reducer
