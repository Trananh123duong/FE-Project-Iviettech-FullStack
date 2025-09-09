import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

/**
 * List các truyện tôi theo dõi
 * Server trả: { data: Story[], meta: { total, page, limit, totalPages } }
 * Params: { page?, limit?, more? }
 */
export const getMyFollows = createAsyncThunk(
  'follow/getMyFollows',
  async (params = {}) => {
    // ĐỔI path nếu bạn mount khác (vd: '/follows' hoặc '/users/me/follows')
    const response = await api.get('/me/follows', { params })
    return {
      ...response.data,            // { data, meta }
      more: params?.more ?? false // cho reducer biết append hay replace
    }
  }
)

/**
 * Follow một truyện
 * Server trả: { is_followed: true, message }
 * Params: { storyId, callback? }
 */
export const followStory = createAsyncThunk(
  'follow/followStory',
  async (params) => {
    const { storyId, callback } = params
    // ĐỔI path nếu khác
    const response = await api.post(`/stories/${storyId}/follow`)
    if (typeof callback === 'function') callback(response.data)
    return { storyId, ...response.data }
  }
)

/**
 * Unfollow một truyện
 * Server trả: { is_followed: false, message }
 * Params: { storyId, callback? }
 */
export const unfollowStory = createAsyncThunk(
  'follow/unfollowStory',
  async (params) => {
    const { storyId, callback } = params
    // ĐỔI path nếu khác
    const response = await api.delete(`/stories/${storyId}/follow`)
    if (typeof callback === 'function') callback(response.data)
    return { storyId, ...response.data }
  }
)
