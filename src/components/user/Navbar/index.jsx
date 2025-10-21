import {
  CaretDownFilled,
  CloseOutlined,
  FireFilled,
  HistoryOutlined,
  HomeFilled,
  MenuOutlined,
  StarOutlined,
  SyncOutlined,
  TrophyOutlined
} from '@ant-design/icons'
import { Divider, Drawer, Dropdown, Spin } from 'antd'
import qs from 'qs'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'

import { STORY_LIMIT } from '@constants/paging'
import { ROUTES } from '@constants/routes'
import { getCategories } from '@redux/thunks/category.thunk'
import * as S from './styles'

/**
 * Tạo URL tới trang Tìm truyện với các tham số chuẩn: Luôn page=1, limit=STORY_LIMIT, order='desc'
 */
const buildSearchPath = (params = {}) => {
  const search = qs.stringify(
    { page: 1, limit: STORY_LIMIT, order: 'desc', ...params },
    { addQueryPrefix: true, arrayFormat: 'brackets', skipNulls: true }
  )
  return `${ROUTES.USER.SEARCH}${search}`
}

const Navbar = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const openMenu = () => setOpen(true)
  const closeMenu = () => setOpen(false)

  const { data: categories = [], status, error } = useSelector(
    (state) => state.category.categoryList
  )

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])

  const categoriesOverlay = useMemo(() => {
    if (status === 'loading') {
      return (
        <S.MegaPanel>
          <div className="panel-body center">
            <Spin size="small" />
            <span className="hint">Đang tải thể loại…</span>
          </div>
        </S.MegaPanel>
      )
    }

    if (status === 'failed') {
      return (
        <S.MegaPanel>
          <div className="panel-body center error">Lỗi: {error}</div>
        </S.MegaPanel>
      )
    }

    return (
      <S.MegaPanel>
        <ul className="grid grid-4">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link to={buildSearchPath({ categoryIds: [cat.id] })}>
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </S.MegaPanel>
    )
  }, [categories, status, error])

  const rankingOverlay = (
    <S.MegaPanel className="compact">
      <ul className="grid grid-2">
        <li>
          <Link to={buildSearchPath({ sort: 'view_all' })}>
            <TrophyOutlined /> Top all
          </Link>
        </li>
        <li className="highlight">
          <Link to={buildSearchPath({ status: 'completed' })}>
            <StarOutlined /> Truyện full
          </Link>
        </li>
        <li>
          <Link to={buildSearchPath({ sort: 'view_month' })}>
            <TrophyOutlined /> Top tháng
          </Link>
        </li>
        <li>
          <Link to={buildSearchPath({ sort: 'updated_at' })}>
            <SyncOutlined /> Mới cập nhật
          </Link>
        </li>
        <li>
          <Link to={buildSearchPath({ sort: 'view_week' })}>
            <TrophyOutlined /> Top tuần
          </Link>
        </li>
        <li>
          <Link to={buildSearchPath({ sort: 'created_at' })}>
            <StarOutlined /> Truyện mới
          </Link>
        </li>
        <li>
          <Link to={buildSearchPath({ sort: 'view_day' })}>
            <TrophyOutlined /> Top ngày
          </Link>
        </li>
        <li>
          <Link to={buildSearchPath({ sort: 'total_follow' })}>
            <StarOutlined /> Top Follow
          </Link>
        </li>
      </ul>
    </S.MegaPanel>
  )

  // Xác định tab đang active theo path hiện tại
  const currentPath = location.pathname

  return (
    <S.NavbarContainer>
      <S.NavInner>
        <button className="menu-btn" type="button" onClick={openMenu} aria-label="Mở menu">
          <MenuOutlined />
        </button>

        <ul className="nav">
          <li className={`nav-item ${currentPath === ROUTES.USER.HOME ? 'active' : ''}`}>
            <Link to={ROUTES.USER.HOME} className="nav-link" aria-label="Trang chủ">
              <HomeFilled />
            </Link>
          </li>

          <li className="nav-item">
            <Link to={buildSearchPath({ sort: 'view_day' })} className="nav-link">
              <FireFilled />
              <span>HOT</span>
            </Link>
          </li>

          <li className={`nav-item ${currentPath === ROUTES.USER.FOLLOW ? 'active' : ''}`}>
            <Link to={ROUTES.USER.FOLLOW} className="nav-link">
              THEO DÕI
            </Link>
          </li>

          <li className={`nav-item ${currentPath === ROUTES.USER.HISTORY ? 'active' : ''}`}>
            <Link to={ROUTES.USER.HISTORY} className="nav-link">
              <HistoryOutlined />
              <span>LỊCH SỬ</span>
            </Link>
          </li>

          <li className="nav-item dropdown">
            <Dropdown
              trigger={['hover']}
              dropdownRender={() => categoriesOverlay}
              placement="bottom"
              overlayClassName="nt-dropdown" // để canh mép trái trùng container
            >
              <button className="nav-link" type="button">
                THỂ LOẠI <CaretDownFilled className="caret" />
              </button>
            </Dropdown>
          </li>

          <li className="nav-item dropdown">
            <Dropdown
              trigger={['hover']}
              dropdownRender={() => rankingOverlay}
              placement="bottom"
              overlayClassName="nt-dropdown" // để canh mép trái trùng container
            >
              <button className="nav-link" type="button">
                XẾP HẠNG <CaretDownFilled className="caret" />
              </button>
            </Dropdown>
          </li>

          <li className={`nav-item ${currentPath === ROUTES.USER.SEARCH ? 'active' : ''}`}>
            <Link to={ROUTES.USER.SEARCH} className="nav-link">
              TÌM TRUYỆN
            </Link>
          </li>
        </ul>

        {/* Drawer menu cho mobile */}
        <Drawer
          placement="left"
          open={open}
          onClose={closeMenu}
          width={320}
          className="nt-mobile-drawer"
          closeIcon={null}
          styles={{ body: { padding: 0 } }}
        >
          <S.MobileMenu>
            <div className="mm-header">
              <span className="title">Menu</span>
              <button className="close" onClick={closeMenu} aria-label="Đóng">
                <CloseOutlined />
              </button>
            </div>

            <div className="mm-section">
              <ul className="list">
                <li><Link onClick={closeMenu} to={ROUTES.USER.HOME}><HomeFilled /> Trang chủ</Link></li>
                <li><Link onClick={closeMenu} to={buildSearchPath({ sort: 'view_day' })}><FireFilled /> HOT</Link></li>
                <li><Link onClick={closeMenu} to={ROUTES.USER.FOLLOW}>Theo dõi</Link></li>
                <li><Link onClick={closeMenu} to={ROUTES.USER.HISTORY}><HistoryOutlined /> Lịch sử</Link></li>
                <li><Link onClick={closeMenu} to={ROUTES.USER.SEARCH}>Tìm truyện</Link></li>
              </ul>
            </div>

            <Divider className="mm-divider" />

            <div className="mm-section">
              <div className="section-title">Xếp hạng</div>
              <ul className="grid grid-2">
                <li><Link onClick={closeMenu} to={buildSearchPath({ sort: 'view_all' })}><TrophyOutlined /> Top all</Link></li>
                <li><Link onClick={closeMenu} to={buildSearchPath({ status: 'completed' })}><StarOutlined /> Truyện full</Link></li>
                <li><Link onClick={closeMenu} to={buildSearchPath({ sort: 'view_month' })}><TrophyOutlined /> Top tháng</Link></li>
                <li><Link onClick={closeMenu} to={buildSearchPath({ sort: 'updated_at' })}><SyncOutlined /> Mới cập nhật</Link></li>
                <li><Link onClick={closeMenu} to={buildSearchPath({ sort: 'view_week' })}><TrophyOutlined /> Top tuần</Link></li>
                <li><Link onClick={closeMenu} to={buildSearchPath({ sort: 'created_at' })}><StarOutlined /> Truyện mới</Link></li>
                <li><Link onClick={closeMenu} to={buildSearchPath({ sort: 'view_day' })}><TrophyOutlined /> Top ngày</Link></li>
                <li><Link onClick={closeMenu} to={buildSearchPath({ sort: 'total_follow' })}><StarOutlined /> Top Follow</Link></li>
              </ul>
            </div>

            <Divider className="mm-divider" />

            <div className="mm-section">
              <div className="section-title">Thể loại</div>
              {status === 'loading' ? (
                <div className="loading"><Spin size="small" /> Đang tải…</div>
              ) : status === 'failed' ? (
                <div className="error">Không tải được thể loại</div>
              ) : (
                <ul className="grid grid-2">
                  {categories.map(cat => (
                    <li key={cat.id}>
                      <Link onClick={closeMenu} to={buildSearchPath({ categoryIds: [cat.id] })}>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </S.MobileMenu>
        </Drawer>
      </S.NavInner>
    </S.NavbarContainer>
  )
}

export default Navbar
