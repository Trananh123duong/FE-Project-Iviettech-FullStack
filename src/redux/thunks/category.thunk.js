import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@services/api'

export const getCategories = createAsyncThunk(
  'category/getCategories',
  async () => {
    const response = await api.get('/categories')
    return response.data
  }
)
