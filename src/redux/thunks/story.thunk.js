import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@services/api'

// List stories
export const getStories = createAsyncThunk(
  'story/getStories',
  async (params) => {
    const response = await api.get('/stories', { params })
    return {
      ...response.data,
      more: params?.more ?? false,
      scope: params?.scope || 'updated',
      sort: params?.sort || null,
    }
  }
)

// Story detail
export const getStory = createAsyncThunk(
  'story/getStory',
  async (params) => {
    const response = await api.get(`/stories/${params.id}`)
    return response.data
  }
)

// Upsert rating rồi lấy summary (đã có user_rating từ API)
export const rateStory = createAsyncThunk(
  'story/rateStory',
  async ({ storyId, rating }) => {
    await api.post(`/stories/${storyId}/rating`, { rating })
    const { data } = await api.get(`/stories/${storyId}/ratings/summary`)
    // data: { story_id, avg_rating, ratings_count, distribution, user_rating }
    return { storyId, summary: data }
  }
)

export const getStoryRatingSummary = createAsyncThunk(
  'story/getStoryRatingSummary',
  async ({ storyId }) => {
    const { data } = await api.get(`/stories/${storyId}/ratings/summary`)
    return { storyId, summary: data }
  }
)

// comments theo truyện (gom tất cả chapter)
export const getStoryComments = createAsyncThunk(
  'story/getStoryComments',
  async ({ storyId, page = 1, limit = 20, order = 'desc', more = false }) => {
    const { data } = await api.get(`/stories/${storyId}/comments`, {
      params: { page, limit, order }
    })
    return { storyId, ...data, page, limit, more }
  }
)
