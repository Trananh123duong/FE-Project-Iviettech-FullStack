import { createSlice } from '@reduxjs/toolkit'
import { getCategories } from '../thunks/category.thunk'

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categoryList: {
      data: [],
      status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getCategories
      .addCase(getCategories.pending, (state) => {
        state.categoryList.status = 'loading'
        state.categoryList.error = null
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categoryList.status = 'succeeded'
        state.categoryList.data = action.payload // mảng [{id, name}, ...]
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.categoryList.status = 'failed'
        state.categoryList.error = action.error.message
      })
  },
})

export default categorySlice.reducer
