import { createSlice } from '@reduxjs/toolkit'
import {
  createChapterComment,
  deleteComment,
  getChapter,
  getChapterComments,
  getChaptersByStory,
  toggleLikeComment
} from '../thunks/chapter.thunk'

const pagedState = () => ({
  data: [],          // comment gốc (mỗi item có thể kèm replies[] do API trả)
  meta: {},          // { total, page, limit, totalPages }
  status: 'idle',
  error: null,
})

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
    chapterComments: pagedState(),
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
      // ====== COMMENTS THEO CHAPTER
      .addCase(getChapterComments.pending, (state, action) => {
        const more = action.meta.arg?.more
        if (!more) state.chapterComments.status = 'loading'
        state.chapterComments.error = null
      })
      .addCase(getChapterComments.fulfilled, (state, action) => {
        const { data, meta, more } = action.payload
        state.chapterComments.status = 'succeeded'
        state.chapterComments.data = more
          ? [...state.chapterComments.data, ...(data || [])]
          : (data || [])
        state.chapterComments.meta = meta || {}
      })
      .addCase(getChapterComments.rejected, (state, action) => {
        state.chapterComments.status = 'failed'
        state.chapterComments.error = action.error.message
      })

      // CREATE COMMENT
      .addCase(createChapterComment.fulfilled, (state, action) => {
        // prepend comment mới vào đầu danh sách
        state.chapterComments.data = [action.payload.comment, ...state.chapterComments.data]
        // tăng total nếu có meta
        if (state.chapterComments?.meta?.total != null) {
          state.chapterComments.meta.total += 1
        }
      })

      // DELETE COMMENT (soft delete)
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId } = action.payload
        state.chapterComments.data = state.chapterComments.data.filter(c => c.id !== commentId)
        if (state.chapterComments?.meta?.total != null) {
          state.chapterComments.meta.total = Math.max(0, state.chapterComments.meta.total - 1)
        }
      })

      // TOGGLE LIKE
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        const { commentId, liked } = action.payload
        const idx = state.chapterComments.data.findIndex(c => c.id === commentId)
        if (idx >= 0) {
          const cmt = state.chapterComments.data[idx]
          // nếu backend chưa trả count, có thể thêm field tạm 'likes_count'
          const likes = Number(cmt.likes_count || 0)
          cmt.likes_count = liked ? likes + 1 : Math.max(0, likes - 1)
          cmt.is_liked = liked
        }
      })
  },
})

export default chapterSlice.reducer
