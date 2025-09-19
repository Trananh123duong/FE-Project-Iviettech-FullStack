import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import qs from 'qs'
import { Dropdown, Spin } from 'antd'
import {
  CaretDownFilled,
  FireFilled,
  HomeFilled,
  HistoryOutlined,
  StarOutlined,
  TrophyOutlined,
  SyncOutlined,
} from '@ant-design/icons'

import { getCategories } from '@redux/thunks/category.thunk'
import { ROUTES } from '@constants/routes'
import { STORY_LIMIT } from '@constants/paging'
import * as S from './styles'

// ========================= HELPERS =========================

/**
 * Tạo URL tới trang Tìm truyện với các tham số chuẩn.
 * - Luôn page=1, limit=STORY_LIMIT, order='desc'
 * - Hỗ trợ mảng categoryIds (arrayFormat=brackets)
 */
const buildSearchPath = (params = {}) => {
  const search = qs.stringify(
    { page: 1, limit: STORY_LIMIT, order: 'desc', ...params },
    { addQueryPrefix: true, arrayFormat: 'brackets', skipNulls: true }
  )
  return `${ROUTES.USER.SEARCH}${search}`
}

// ========================= COMPONENT =========================

const Navbar = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  // Lấy danh sách thể loại từ Redux
  const { data: categories = [], status, error } = useSelector(
    (state) => state.category.categoryList
  )

  // Tải thể loại lần đầu
  useEffect(() => {
    if (status === 'idle') dispatch(getCategories())
  }, [status, dispatch])

  // -------- Overlay: THỂ LOẠI (mega menu 4 cột) --------
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

  // -------- Overlay: XẾP HẠNG (menu gọn 2 cột) --------
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

  // ========================= RENDER =========================
  return (
    <S.NavbarContainer>
      <S.NavInner>
        <ul className="nav">
          {/* Trang chủ */}
          <li className={`nav-item ${currentPath === ROUTES.USER.HOME ? 'active' : ''}`}>
            <Link to={ROUTES.USER.HOME} className="nav-link" aria-label="Trang chủ">
              <HomeFilled />
            </Link>
          </li>

          {/* HOT (view_day) */}
          <li className="nav-item">
            <Link to={buildSearchPath({ sort: 'view_day' })} className="nav-link">
              <FireFilled />
              <span>HOT</span>
            </Link>
          </li>

          {/* THEO DÕI */}
          <li className={`nav-item ${currentPath === ROUTES.USER.FOLLOW ? 'active' : ''}`}>
            <Link to={ROUTES.USER.FOLLOW} className="nav-link">
              THEO DÕI
            </Link>
          </li>

          {/* LỊCH SỬ */}
          <li className={`nav-item ${currentPath === ROUTES.USER.HISTORY ? 'active' : ''}`}>
            <Link to={ROUTES.USER.HISTORY} className="nav-link">
              <HistoryOutlined />
              <span>LỊCH SỬ</span>
            </Link>
          </li>

          {/* THỂ LOẠI (Dropdown mega) */}
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

          {/* XẾP HẠNG (Dropdown gọn) */}
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

          {/* TÌM TRUYỆN */}
          <li className={`nav-item ${currentPath === ROUTES.USER.SEARCH ? 'active' : ''}`}>
            <Link to={ROUTES.USER.SEARCH} className="nav-link">
              TÌM TRUYỆN
            </Link>
          </li>
        </ul>
      </S.NavInner>
    </S.NavbarContainer>
  )
}

export default Navbar
