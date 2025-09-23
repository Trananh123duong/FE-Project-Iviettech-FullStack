import { createSlice } from '@reduxjs/toolkit'
import {
  getStories,
  getStory,
  getStoryComments,
  getStoryRatingSummary,
  rateStory
} from '../thunks/story.thunk'

const listState = () => ({
  data: [],
  meta: {},
  status: 'idle',
  error: null,
})

const pagedState = () => ({
  data: [],          // mảng bình luận (comment gốc + replies đã include)
  meta: {},          // { total, page, limit, totalPages }
  status: 'idle',
  error: null,
})

export const storySlice = createSlice({
  name: 'story',
  initialState: {
    sliderbarList: listState(),
    updatedList: listState(),
    searchList:  listState(),
    topLists: {
      view_month: listState(),
      view_week:  listState(),
      view_day:   listState(),
    },
    storyDetail: {
      data: {},
      status: 'idle',
      error: null,
    },
    ratingSummary: {
      // { story_id, avg_rating, ratings_count, distribution: {1..5} }
      data: null,
      status: 'idle',
      error: null,
    },
    storyComments: pagedState(),
  },
  reducers: {},
  extraReducers: (builder) => {
    const pickTarget = (state, scope, sort) => {
      switch (scope) {
        case 'sliderbar': return state.sliderbarList
        case 'updated': return state.updatedList
        case 'search':    return state.searchList
        case 'top':       return state.topLists[sort] || state.topLists.view_day
        default:          return state.updatedList
      }
    }

    builder
      // getStories
      .addCase(getStories.pending, (state, action) => {
        const { scope = 'updated', sort = null } = action.meta.arg || {}
        const target = pickTarget(state, scope, sort)
        target.status = 'loading'
        target.error = null
      })
      .addCase(getStories.fulfilled, (state, action) => {
        const { data, meta, more } = action.payload
        const { scope = 'updated', sort = null } = action.meta.arg || {}
        const target = pickTarget(state, scope, sort)
        target.status = 'succeeded'
        target.data = more ? [...target.data, ...data] : data
        target.meta = meta
      })
      .addCase(getStories.rejected, (state, action) => {
        const { scope = 'updated', sort = null } = action.meta.arg || {}
        const target = pickTarget(state, scope, sort)
        target.status = 'failed'
        target.error = action.error.message
      })

      // getStory
      .addCase(getStory.pending, (state) => {
        state.storyDetail.status = 'loading'
        state.storyDetail.error = null
      })
      .addCase(getStory.fulfilled, (state, action) => {
        state.storyDetail.status = 'succeeded'
        state.storyDetail.data = action.payload
      })
      .addCase(getStory.rejected, (state, action) => {
        state.storyDetail.status = 'failed'
        state.storyDetail.error = action.error.message
      })
      // RATE STORY (upsert) → cập nhật summary & đồng bộ storyDetail nếu trùng id
      .addCase(rateStory.fulfilled, (state, action) => {
        state.ratingSummary.status = 'succeeded'
        state.ratingSummary.data = action.payload.summary
        state.ratingSummary.data = { ...action.payload.summary, my_rating: action.payload.myRating }
        // đồng bộ avg/count vào storyDetail nếu trùng
        if (state.storyDetail?.data?.id === action.payload.storyId) {
          state.storyDetail.data = {
            ...state.storyDetail.data,
            avg_rating: action.payload.summary.avg_rating,
            ratings_count: action.payload.summary.ratings_count,
          }
        }
      })
      // STORY COMMENTS
      .addCase(getStoryComments.pending, (state, action) => {
        const more = action.meta.arg?.more
        if (!more) {
          state.storyComments.status = 'loading'
        }
        state.storyComments.error = null
      })
      .addCase(getStoryComments.fulfilled, (state, action) => {
        const { data, meta, more } = action.payload
        state.storyComments.status = 'succeeded'
        state.storyComments.data = more
          ? [...state.storyComments.data, ...(data || [])]
          : (data || [])
        state.storyComments.meta = meta || {}
      })
      .addCase(getStoryComments.rejected, (state, action) => {
        state.storyComments.status = 'failed'
        state.storyComments.error = action.error.message
      })
      // ====== RATING SUMMARY ======
      .addCase(getStoryRatingSummary.pending, (state) => {
        state.ratingSummary.status = 'loading'
        state.ratingSummary.error = null
      })
      .addCase(getStoryRatingSummary.fulfilled, (state, action) => {
        state.ratingSummary.status = 'succeeded'
        state.ratingSummary.data = action.payload.summary   // { story_id, avg_rating, ratings_count, distribution }
      })
      .addCase(getStoryRatingSummary.rejected, (state, action) => {
        state.ratingSummary.status = 'failed'
        state.ratingSummary.error = action.error.message
      })
  },
})

export default storySlice.reducer
