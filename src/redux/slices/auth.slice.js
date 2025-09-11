import { createSlice } from '@reduxjs/toolkit'
import {
  register,
  login,
  getMyProfile,
  refreshAccessToken,
} from '../thunks/auth.thunk'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    myProfile: {
      data: {},
      status: 'idle',
      error: null,
    },
    registerData: {
      status: 'idle',
      error: null,
    },
    loginData: {
      status: 'idle',
      error: null,
    },
    refreshData: {
      status: 'idle',
      error: null,
    },
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      state.myProfile.data = {}
      state.loginData.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (state) => {
        state.registerData.status = 'loading'
        state.registerData.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.registerData.status = 'succeeded'
      })
      .addCase(register.rejected, (state, action) => {
        state.registerData.status = 'failed'
        state.registerData.error = action.error.message
      })

      // login
      .addCase(login.pending, (state) => {
        state.loginData.status = 'loading'
        state.loginData.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        const { accessToken, refreshToken, user } = action.payload || {}

        if (accessToken) localStorage.setItem('accessToken', accessToken)
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

        state.loginData.status = 'succeeded'
        state.myProfile.data = user || {}
      })
      .addCase(login.rejected, (state, action) => {
        state.loginData.status = 'failed'
        state.loginData.error = action.error.message
      })

      // getMyProfile
      .addCase(getMyProfile.pending, (state) => {
        state.myProfile.status = 'loading'
        state.myProfile.error = null
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.myProfile.status = 'succeeded'
        state.myProfile.data = action.payload || {}
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.myProfile.status = 'failed'
        state.myProfile.error = action.error.message
      })

      // refreshAccessToken
      .addCase(refreshAccessToken.pending, (state) => {
        state.refreshData.status = 'loading'
        state.refreshData.error = null
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        const { accessToken } = action.payload || {}
        if (accessToken) localStorage.setItem('accessToken', accessToken)
        state.refreshData.status = 'succeeded'
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.refreshData.status = 'failed'
        state.refreshData.error = action.payload || action.error.message
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
