import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'
import Dashboard from './pages/admin/Dashboard'
import Home from './pages/user/Home'

import { ROUTES } from './constants/routes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path={ROUTES.USER.HOME} element={<Home />}/>
        </Route>

        {/* <Route element={<AdminLayout />}>
          <Route element={<Dashboard />}/>
        </Route> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
