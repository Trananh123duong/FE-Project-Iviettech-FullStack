// chapter.thunk.js
import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@services/api'

export const getChaptersByStory = createAsyncThunk(
  'chapter/getChaptersByStory',
  async ({ storyId }) => {
    const { data } = await api.get(`/stories/${storyId}/chapters`)
    return data // { chapters, history }
  }
)

export const getChapter = createAsyncThunk(
  'chapter/getChapter',
  async ({ id }) => {
    const { data } = await api.get(`/chapters/${id}`)
    return data
  }
)
