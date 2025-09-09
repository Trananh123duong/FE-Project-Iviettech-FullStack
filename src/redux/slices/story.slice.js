import { createSlice } from '@reduxjs/toolkit'
import { getStories, getStory } from '../thunks/story.thunk'

export const storySlice = createSlice({
  name: 'story',
  initialState: {
    storyList: {
      data: [],
      meta: {},
      status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
      error: null,
    },
    storyDetail: {
      data: {},
      status: 'idle',
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getStories
      .addCase(getStories.pending, (state) => {
        state.storyList.status = 'loading'
        state.storyList.error = null
      })
      .addCase(getStories.fulfilled, (state, action) => {
        const { data, meta, more } = action.payload
        state.storyList.status = 'succeeded'
        state.storyList.data = more
          ? [...state.storyList.data, ...data]
          : data
        state.storyList.meta = meta
      })
      .addCase(getStories.rejected, (state, action) => {
        state.storyList.status = 'failed'
        state.storyList.error = action.error.message
      })

      // getStory
      .addCase(getStory.pending, (state) => {
        state.storyDetail.status = 'loading'
        state.storyDetail.error = null
      })
      .addCase(getStory.fulfilled, (state, action) => {
        state.storyDetail.status = 'succeeded'
        state.storyDetail.data = action.payload
      })
      .addCase(getStory.rejected, (state, action) => {
        state.storyDetail.status = 'failed'
        state.storyDetail.error = action.error.message
      })
  },
})

export default storySlice.reducer
