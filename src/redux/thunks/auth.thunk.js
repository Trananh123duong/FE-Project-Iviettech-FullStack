import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const register = createAsyncThunk('auth/register', async (params) => {
  const { data, callback } = params
  const response = await api.post('/auth/register', data)
  if (callback) callback(response.data) // optional
  return response.data
})

export const login = createAsyncThunk('auth/login', async (params) => {
  const { data, callback } = params
  const response = await api.post('/auth/login', data)
  const { user } = response.data
  if (callback) callback?.(user?.role)
  return response.data
})

export const getMyProfile = createAsyncThunk('auth/getMyProfile', async () => {
  const response = await api.get('/auth/my-profile')
  return response.data
})

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) return rejectWithValue('No refresh token')

      const res = await api.post('/auth/refresh', { token: refreshToken })
      return res.data // { accessToken }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Refresh token failed'
      return rejectWithValue(msg)
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (params, { rejectWithValue }) => {
    try {
      const { data, callback } = params || {} // data: { username: '...' }
      const res = await api.patch('/auth/my-profile', data)
      callback?.(res.data?.user)
      return res.data // backend: { message, user }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Update profile failed'
      return rejectWithValue(msg)
    }
  }
)

export const uploadAvatar = createAsyncThunk(
  'auth/uploadAvatar',
  async (params) => {
    const res = await api.post('/auth/upload-avatar', params.data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    params.callback && params.callback()
    return res.data // { message, user }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (params, { rejectWithValue }) => {
    try {
      // params: { currentPassword, newPassword, callback? }
      const { callback, ...payload } = params || {}
      const res = await api.patch('/auth/change-password', payload)
      callback?.(res.data)
      return res.data // { message }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Change password failed'
      return rejectWithValue(msg)
    }
  }
)

export const logoutServer = createAsyncThunk(
  'auth/logoutServer',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/logout')
      return res.data // { message }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Logout failed'
      return rejectWithValue(msg)
    }
  }
)