import {
  BellOutlined,
  BookOutlined,
  BulbOutlined,
  CaretDownOutlined,
  FormOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Badge, Button, Dropdown, Input } from 'antd'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import logoImg from '@assets/logo.png'
import { ROUTES } from '@constants/routes'
import { logoutServer } from '@redux/thunks/auth.thunk'
import * as S from './styles'

// ========================= COMPONENT =========================
const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const profile = useSelector((state) => state.auth.myProfile.data)
  const isAuthenticated = !!profile?.id
  const userDisplayName = profile?.username || profile?.email || 'Tài khoản'

  // --- Trạng thái ô tìm kiếm
  const [searchText, setSearchText] = useState('')

  // --- Đăng xuất
  const handleLogout = () => {
    dispatch(logoutServer())
      .unwrap()
      .finally(() => {
        navigate(ROUTES.USER.HOME)
      })
  }

  // --- Thực hiện tìm kiếm
  const handleSearch = () => {
    const keyword = searchText.trim()
    if (!keyword) return
    navigate(`${ROUTES.USER.SEARCH}?q=${encodeURIComponent(keyword)}`)
  }

  // --- Menu tài khoản (tùy theo đã đăng nhập hay chưa)
  const accountMenuItems = useMemo(() => {
    if (isAuthenticated) {
      return [
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: 'Trang cá nhân',
          onClick: () => navigate(ROUTES.USER.PROFILE),
        },
        {
          key: 'follow',
          icon: <BookOutlined />,
          label: 'Truyện theo dõi',
          onClick: () => navigate(ROUTES.USER.FOLLOW),
        },
        { type: 'divider' },
        {
          key: 'logout',
          danger: true,
          icon: <LogoutOutlined />,
          label: 'Thoát',
          onClick: handleLogout,
        },
      ]
    }

    return [
      {
        key: 'login',
        icon: <LoginOutlined />,
        label: <Link to={ROUTES.AUTH.LOGIN}>Đăng nhập</Link>,
      },
      {
        key: 'register',
        icon: <FormOutlined />,
        label: <Link to={ROUTES.AUTH.REGISTER}>Đăng ký</Link>,
      },
    ]
  }, [isAuthenticated])

  // ========================= RENDER =========================
  return (
    <S.HeaderContainer>
      <S.Inner>
        {/* Logo / home */}
        <Link to={ROUTES.USER.HOME} className="logo" aria-label="Trang chủ">
          <img src={logoImg} alt="NetTruyen Logo" />
        </Link>

        {/* Search */}
        <div className="search-wrap">
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            placeholder="Tìm truyện..."
            className="nt-input"
            aria-label="Ô tìm kiếm truyện"
          />
          <button
            className="nt-search-btn"
            aria-label="Tìm kiếm"
            onClick={handleSearch}
            type="button"
          >
            <SearchOutlined />
          </button>
        </div>

        {/* Nhóm nút bên phải */}
        <div className="right">
          <Button
            type="text"
            className="icon-btn"
            onClick={() => navigate(ROUTES.USER.HOME)}
            aria-label="Trang chủ"
          >
            <HomeOutlined />
          </Button>

          <Button type="text" className="icon-btn" onClick={() => {}} aria-label="Chế độ tối">
            <BulbOutlined />
          </Button>

          <Badge dot offset={[0, 2]}>
            <Button
              type="text"
              className="icon-btn"
              onClick={() => navigate('/notifications')}
              aria-label="Thông báo"
            >
              <BellOutlined />
            </Button>
          </Badge>

          <Dropdown
            trigger={['hover']}
            menu={{ items: accountMenuItems }}
            placement="bottomRight"
            overlayClassName="account-menu"
          >
            <button type="button" className="account-btn" aria-label="Mở menu tài khoản">
              <Avatar size={28} icon={<UserOutlined />} />
              <span className="name">{userDisplayName}</span>
              <CaretDownOutlined className="caret" />
            </button>
          </Dropdown>
        </div>
      </S.Inner>
    </S.HeaderContainer>
  )
}

export default Header
