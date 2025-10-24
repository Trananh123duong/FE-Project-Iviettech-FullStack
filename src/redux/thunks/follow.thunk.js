import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@services/api'

export const getMyFollows = createAsyncThunk(
  'follow/getMyFollows',
  async (params = {}) => {
    const response = await api.get('/me/follow', { params })
    return {...response.data}
  }
)

export const followStory = createAsyncThunk(
  'follow/followStory',
  async (params) => {
    const { storyId, callback } = params
    const response = await api.post(`/stories/${storyId}/follow`)
    if (typeof callback === 'function') callback(response.data)
    return { storyId, ...response.data }
  }
)

export const unfollowStory = createAsyncThunk(
  'follow/unfollowStory',
  async (params) => {
    const { storyId, callback } = params
    const response = await api.delete(`/stories/${storyId}/follow`)
    if (typeof callback === 'function') callback(response.data)
    return { storyId, ...response.data }
  }
)
