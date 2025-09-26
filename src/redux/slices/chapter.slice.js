import { createSlice } from '@reduxjs/toolkit'
import {
  createChapterComment,
  deleteComment,
  getChapter,
  getChapterComments,
  getChaptersByStory,
  likeComment,
  unlikeComment,
} from '../thunks/chapter.thunk'

const pagedState = () => ({
  data: [],          // comment gốc (mỗi item có thể kèm replies[] do API trả)
  meta: {},          // { total, page, limit, totalPages }
  status: 'idle',
  error: null,
})

// Helper: tìm và cập nhật 1 comment (kể cả reply) theo id
function patchCommentById(list, commentId, patch) {
  for (const c of list) {
    if (c.id === commentId) {
      Object.assign(c, patch)
      return true
    }
    if (Array.isArray(c.story_comments)) {
      const r = c.story_comments.find(x => x.id === commentId)
      if (r) {
        Object.assign(r, patch)
        return true
      }
    }
  }
  return false
}

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
      // ===== chapters list =====
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

      // ===== chapter detail =====
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

      // ===== comments (paged) =====
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

      // ===== like / unlike =====
      .addCase(likeComment.fulfilled, (state, action) => {
        const { commentId, is_liked, likes_count } = action.payload
        patchCommentById(state.chapterComments.data, commentId, {
          is_liked: !!is_liked,
          likes_count: Number(likes_count ?? 0),
          liked: !!is_liked, // nếu UI còn dùng 'liked'
        })
      })
      .addCase(unlikeComment.fulfilled, (state, action) => {
        const { commentId, is_liked, likes_count } = action.payload
        patchCommentById(state.chapterComments.data, commentId, {
          is_liked: !!is_liked,
          likes_count: Number(likes_count ?? 0),
          liked: !!is_liked,
        })
      })
  },
})

export default chapterSlice.reducer
