import { Route, Routes } from 'react-router-dom'
import './App.css'
import UserLayout from './layouts/UserLayout'
import Home from './pages/user/Home'

import { ROUTES } from './constants/routes'

function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path={ROUTES.USER.HOME} element={<Home />}/>
      </Route>

      {/* <Route element={<AdminLayout />}>
        <Route element={<Dashboard />}/>
      </Route> */}
    </Routes>
  )
}

export default App
