import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@services/api'

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
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return rejectWithValue('No refresh token')

    const res = await api.post('/auth/refresh-token', { token: refreshToken })
    return res.data
  }
)
