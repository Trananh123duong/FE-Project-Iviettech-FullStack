import { configureStore } from '@reduxjs/toolkit'
import categoryReducer from './redux/slices/category.slice'
import chapterReducer from './redux/slices/chapter.slice'
import followReducer from './redux/slices/follow.slice'
import historyReducer from './redux/slices/history.slice'
import storyReducer from './redux/slices/story.slice'
import authReducer from './redux/slices/auth.slice'

export default configureStore({
  reducer: {
    story: storyReducer,
    category: categoryReducer,
    chapter: chapterReducer,
    follow: followReducer,
    history: historyReducer,
    auth: authReducer,
  },
})