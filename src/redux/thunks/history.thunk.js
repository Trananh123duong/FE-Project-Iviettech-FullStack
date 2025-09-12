import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@services/api'

// GET /me/history  -> { data: [...], meta: { total, page, limit, totalPages } }
export const getMyHistory = createAsyncThunk(
  'history/getMyHistory',
  async (params = {}) => {
    const response = await api.get('/me/history', { params })
    return {
      ...response.data,             // { data, meta }
      more: params?.more ?? false,  // báo reducer append hay replace
    }
  }
)

// DELETE /me/history/:id -> { message }
export const deleteHistoryItem = createAsyncThunk(
  'history/deleteHistoryItem',
  async (params) => {
    const { id, callback } = params
    const response = await api.delete(`/me/history/${id}`)
    if (typeof callback === 'function') callback(response.data)
    return { id, ...response.data } // { id, message }
  }
)
