import { createSlice } from '@reduxjs/toolkit'
import { getChapter, getChaptersByStory } from '../thunks/chapter.thunk'

export const chapterSlice = createSlice({
  name: 'chapter',
  initialState: {
    chaptersByStory: {
      data: [],          // mảng chapters
      history: null,     // { chapter_id, last_read_at } | null
      status: 'idle',    // 'idle' | 'loading' | 'succeeded' | 'failed'
      error: null,
    },
    chapterDetail: {
      data: {},          // object chapter (kèm chapter_images nếu có)
      status: 'idle',
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getChaptersByStory
      .addCase(getChaptersByStory.pending, (state) => {
        state.chaptersByStory.status = 'loading'
        state.chaptersByStory.error = null
      })
      .addCase(getChaptersByStory.fulfilled, (state, action) => {
        const { chapters, history } = action.payload
        state.chaptersByStory.status = 'succeeded'
        state.chaptersByStory.data = chapters
        state.chaptersByStory.history = history ?? null
      })
      .addCase(getChaptersByStory.rejected, (state, action) => {
        state.chaptersByStory.status = 'failed'
        state.chaptersByStory.error = action.error.message
      })

      // getChapter
      .addCase(getChapter.pending, (state) => {
        state.chapterDetail.status = 'loading'
        state.chapterDetail.error = null
      })
      .addCase(getChapter.fulfilled, (state, action) => {
        state.chapterDetail.status = 'succeeded'
        state.chapterDetail.data = action.payload
      })
      .addCase(getChapter.rejected, (state, action) => {
        state.chapterDetail.status = 'failed'
        state.chapterDetail.error = action.error.message
      })
  },
})

export default chapterSlice.reducer
