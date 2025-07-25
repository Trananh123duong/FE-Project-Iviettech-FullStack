import { Outlet } from 'react-router-dom'
import Footer from '../../components/admin/Footer'
import Header from '../../components/admin/Header'

const AdminLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default AdminLayout
