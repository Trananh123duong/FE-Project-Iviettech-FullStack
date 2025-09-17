import { createSlice } from '@reduxjs/toolkit'
import { getChapter, getChaptersByStory } from '../thunks/chapter.thunk'

export const chapterSlice = createSlice({
  name: 'chapter',
  initialState: {
    chaptersByStory: {
      data: [],
      history: null,
      status: 'idle',
      error: null,
    },
    chapterDetail: {
      data: {},                  // object chapter (+ chapter_images)
      story_name: null,          
      previousChapterId: null,
      nextChapterId: null,
      is_following: false,
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
        state.chapterDetail.data = {}
        state.chapterDetail.story_name = null
        state.chapterDetail.previousChapterId = null
        state.chapterDetail.nextChapterId = null
        state.chapterDetail.is_following = false
      })
      .addCase(getChapter.fulfilled, (state, action) => {
        state.chapterDetail.status = 'succeeded'
        const {
          story_name,
          previousChapterId,
          nextChapterId,
          is_following,
          ...chapter
        } = action.payload
        state.chapterDetail.data = chapter
        state.chapterDetail.story_name = story_name ?? null
        state.chapterDetail.previousChapterId = previousChapterId ?? null
        state.chapterDetail.nextChapterId = nextChapterId ?? null
        state.chapterDetail.is_following = !!is_following
      })
      .addCase(getChapter.rejected, (state, action) => {
        state.chapterDetail.status = 'failed'
        state.chapterDetail.error = action.error.message
      })
  },
})

export default chapterSlice.reducer
