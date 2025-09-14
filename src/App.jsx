import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import './App.css'
import UserLayout from '@layouts/UserLayout'
import Home from '@pages/user/Home'

import { ROUTES } from '@constants/routes'
import Login from '@pages/auth/Login'
import Register from '@pages/auth/Register'

import { getMyProfile } from '@redux/thunks/auth.thunk'
import Follow from '@pages/user/Follow'
import HistoryPage from '@pages/user/History'
import SearchPage from '@pages/user/Search'
import StoryDetail from '@pages/user/StoryDetail'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(getMyProfile())
    }
  }, [dispatch])

  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
        <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />

        <Route path={ROUTES.USER.HOME} element={<Home />}/>
        <Route path={ROUTES.USER.FOLLOW} element={<Follow />}/>
        <Route path={ROUTES.USER.HISTORY} element={<HistoryPage />}/>
        <Route path={ROUTES.USER.SEARCH} element={<SearchPage />} />
        
        <Route path={ROUTES.USER.STORY} element={<StoryDetail />} />
      </Route>

      {/* <Route element={<AdminLayout />}>
        <Route element={<Dashboard />}/>
      </Route> */}
    </Routes>
  )
}

export default App
