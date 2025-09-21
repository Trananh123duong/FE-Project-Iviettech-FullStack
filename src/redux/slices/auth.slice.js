import { createSlice } from '@reduxjs/toolkit'
import {
  register,
  login,
  getMyProfile,
  refreshAccessToken,
  updateProfile,
  uploadAvatar
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
    updateData: {
      status: 'idle',
      error: null,
    },
    avatarData: {
      status: 'idle',
      error: null
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
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.updateData.status = 'loading'
        state.updateData.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateData.status = 'succeeded'
        const updatedUser = action.payload?.user || action.payload || {}
        state.myProfile.data = {
          ...state.myProfile.data,
          ...updatedUser,
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateData.status = 'failed'
        state.updateData.error = action.payload || action.error.message
      })
      // uploadAvatar
      .addCase(uploadAvatar.pending, (state) => {
        state.avatarData.status = 'loading'
        state.avatarData.error = null
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.avatarData.status = 'succeeded'
        const updatedUser = action.payload?.user || {}
        state.myProfile.data = { ...state.myProfile.data, ...updatedUser }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.avatarData.status = 'failed'
        state.avatarData.error = action.payload || action.error.message
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
