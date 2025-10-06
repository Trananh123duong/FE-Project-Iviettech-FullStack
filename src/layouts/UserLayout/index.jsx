import AdOverlay from '@components/user/AdOverlay'
import Footer from '@components/user/Footer'
import Header from '@components/user/Header'
import Navbar from '@components/user/Navbar'
import { Outlet } from 'react-router-dom'
import * as S from './styles'

const UserLayout = () => {
  return (
    <>
      <Header />
      <Navbar />
      <S.Main>
        <S.MainContainer>
          <AdOverlay />
          <Outlet />
        </S.MainContainer>
      </S.Main>
      <Footer />
    </>
  )
}

export default UserLayout
