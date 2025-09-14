import { createSlice } from '@reduxjs/toolkit'
import { getStories, getStory } from '../thunks/story.thunk'

const listState = () => ({
  data: [],
  meta: {},
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
  },
})

export default storySlice.reducer
