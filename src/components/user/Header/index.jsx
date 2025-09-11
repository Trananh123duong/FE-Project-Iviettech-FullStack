import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ROUTES } from '../../../constants/routes'
import { logout } from '../../../redux/slices/auth.slice'
import * as S from './styles'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.myProfile.data)

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.USER.HOME)
  }

  const isLoggedIn = !!user?.id
  const displayName = user?.username || user?.email

  return (
    <S.HeaderContainer>
      <S.Navbar>
        <Link to={ROUTES.USER.HOME}>
          <img
            src="https://nettruyenvia.com/assets/images/logo-nettruyen.png"
            alt="logo"
          />
        </Link>

        <S.SearchBox>
          <input type="text" placeholder="Tìm truyện..." />
          <button aria-label="Tìm kiếm">
            <i className="fa fa-search" />
          </button>
        </S.SearchBox>

        <S.RightGroup>
          <S.IconGroup>
            <i className="fa fa-lightbulb-o toggle-dark" title="Chế độ tối" />
            <i className="fa fa-comment notifications" title="Thông báo" />
          </S.IconGroup>

          <S.Account>
            <S.AccountBtn>
              <i className="fa fa-user" />
              <span>{isLoggedIn ? displayName : 'Tài khoản'}</span>
              <i className="fa fa-caret-down caret" />
            </S.AccountBtn>

            {isLoggedIn ? (
              <S.Menu className="menu">
                <button onClick={() => navigate('/profile')}>
                  <i className="fa fa-user" />
                  <span>Trang cá nhân</span>
                </button>
                <button onClick={() => navigate('/theo-doi')}>
                  <i className="fa fa-book" />
                  <span>Truyện theo dõi</span>
                </button>
                <button onClick={handleLogout}>
                  <i className="fa fa-sign-out" />
                  <span>Thoát</span>
                </button>
              </S.Menu>
            ) : (
              <S.Menu className="menu">
                <Link to={ROUTES.AUTH.LOGIN}>
                  <i className="fa fa-user" />
                  <span>Đăng nhập</span>
                </Link>
                <Link to={ROUTES.AUTH.REGISTER}>
                  <i className="fa fa-pencil-square-o" />
                  <span>Đăng ký</span>
                </Link>
              </S.Menu>
            )}
          </S.Account>
        </S.RightGroup>
      </S.Navbar>
    </S.HeaderContainer>
  )
}

export default Header
