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
