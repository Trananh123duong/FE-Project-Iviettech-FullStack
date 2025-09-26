import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@services/api'

export const getChaptersByStory = createAsyncThunk(
  'chapter/getChaptersByStory',
  async ({ storyId }) => {
    const { data } = await api.get(`/stories/${storyId}/chapters`)
    return data // { chapters, history }
  }
)

export const getChapter = createAsyncThunk(
  'chapter/getChapter',
  async ({ id }) => {
    const { data } = await api.get(`/chapters/${id}`)
    return data
  }
)

// COMMENT THEO CHAPTER
export const getChapterComments = createAsyncThunk(
  'chapter/getChapterComments',
  async ({ chapterId, page = 1, limit = 20, order = 'desc', more = false }) => {
    const { data } = await api.get(`/chapters/${chapterId}/comments`, {
      params: { page, limit, order }
    })
    return { chapterId, ...data, page, limit, more }
  }
)

export const createChapterComment = createAsyncThunk(
  'chapter/createChapterComment',
  async ({ chapterId, body, parent_id = null }) => {
    const { data } = await api.post(`/chapters/${chapterId}/comments`, { body, parent_id })
    return { chapterId, comment: data }
  }
)

export const deleteComment = createAsyncThunk(
  'chapter/deleteComment',
  async ({ commentId }) => {
    await api.delete(`/chapters/comments/${commentId}`)
    return { commentId }
  }
)

export const likeComment = createAsyncThunk(
  'chapter/likeComment',
  async ({ commentId }) => {
    const { data } = await api.post(`/chapters/comments/${commentId}/like`)
    // { is_liked: true, likes_count }
    return { commentId, ...data }
  }
)

export const unlikeComment = createAsyncThunk(
  'chapter/unlikeComment',
  async ({ commentId }) => {
    const { data } = await api.delete(`/chapters/comments/${commentId}/like`)
    // { is_liked: false, likes_count }
    return { commentId, ...data }
  }
)
