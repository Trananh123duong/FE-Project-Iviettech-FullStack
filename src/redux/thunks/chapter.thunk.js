import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@services/api'

export const getChaptersByStory = createAsyncThunk(
  'chapter/getChaptersByStory',
  async (params) => {
    const { storyId } = params
    const response = await api.get(`/stories/${storyId}/chapters`)
    return response.data
  }
)

export const getChapter = createAsyncThunk(
  'chapter/getChapter',
  async (params) => {
    const { id } = params
    const response = await api.get(`/chapters/${id}`)
    return response.data
  }
)
