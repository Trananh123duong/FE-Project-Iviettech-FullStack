import { Button, Empty } from 'antd'
import qs from 'qs'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import FollowedStories from '@components/user/FollowedStories'
import HistoryList from '@components/user/HistoryList'
import Paginate from '@components/user/Paginate'
import TopStory from '@components/user/TopStory'

import { STORY_LIMIT } from '@constants/paging'
import { ROUTES } from '@constants/routes'
import { getMyHistory } from '@redux/thunks/history.thunk'
import * as S from './styles'

const HistoryPage = () => {
  // --- Hook core
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // --- Lấy thông tin đăng nhập (quyết định hiển thị gate đăng nhập)
  const { data: user } = useSelector((s) => s.auth.myProfile)

  // --- Dữ liệu lịch sử đọc từ slice history
  const {
    data: items = [],
    meta = {},
    status,
    error,
  } = useSelector((s) => s.history.historyList)

  // --- Đọc query string (page, limit) từ URL
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const urlPage = parseInt(query.page || 1, 10)
  const urlLimit = parseInt(query.limit || STORY_LIMIT, 10)

  // --- Khi đã đăng nhập -> gọi API lấy lịch sử đọc theo page/limit hiện tại
  useEffect(() => {
    if (user?.id) {
      dispatch(getMyHistory({ page: urlPage, limit: urlLimit, more: false }))
    }
  }, [dispatch, user?.id, urlPage, urlLimit])

  // --- Thông tin phân trang (fallback về URL khi meta chưa có)
  const current = meta.page || urlPage
  const pageSize = meta.limit || urlLimit
  const total = meta.total || 0

  // --- Chuyển trang: cập nhật query string, giữ nguyên pathname (History)
  const handlePaginate = (page, size) => {
    const newQuery = qs.stringify({ ...query, page, limit: size }, { addQueryPrefix: true })
    navigate(`${location.pathname}${newQuery}`, { replace: false })
  }

  // --- Nếu chưa đăng nhập: hiển thị gate + link sang trang đăng nhập (DÙNG ROUTES)
  if (!user?.id) {
    return (
      <>
        <S.BreadcrumbBar>
          <S.Breadcrumb>
            <Link to={ROUTES.USER.HOME}>Trang chủ</Link>
            <span className="sep">»</span>
            <span className="current">Lịch sử</span>
          </S.Breadcrumb>
        </S.BreadcrumbBar>

        <S.Gate>
          <h2>Lịch sử đọc truyện</h2>
          <p>Bạn cần đăng nhập để xem lịch sử đọc.</p>
          <Link to={ROUTES.AUTH.LOGIN}>
            <Button type="primary" size="large">Đăng nhập</Button>
          </Link>
        </S.Gate>
      </>
    )
  }

  // --- Đã đăng nhập: hiển thị danh sách lịch sử + paginate + sidebar
  return (
    <>
      {/* Breadcrumb (DÙNG ROUTES) */}
      <S.BreadcrumbBar>
        <S.Breadcrumb>
          <Link to={ROUTES.USER.HOME}>Trang chủ</Link>
          <span className="sep">»</span>
          <span className="current">Lịch sử</span>
        </S.Breadcrumb>
      </S.BreadcrumbBar>

      <S.MainContainer>
        {/* Cột chính: lịch sử đọc */}
        <S.ListColumn>
          <S.SectionHeader>
            <S.SectionTitle>
              Lịch sử đọc truyện <i className="fa-solid fa-angle-right" />
            </S.SectionTitle>
          </S.SectionHeader>

          {status === 'succeeded' && items.length === 0 ? (
            <Empty style={{ margin: '16px 0' }} description="Bạn chưa có lịch sử đọc." />
          ) : (
            <>
              {/* Danh sách lịch sử đọc */}
              <HistoryList items={items} status={status} error={error} />

              {/* Phân trang: thay đổi query string để giữ state URL */}
              <Paginate
                current={current}
                pageSize={pageSize}
                total={total}
                onChange={handlePaginate}
              />
            </>
          )}
        </S.ListColumn>

        {/* Cột bên: gợi ý/tiện ích */}
        <S.SideColumn>
          <FollowedStories />
          <TopStory />
        </S.SideColumn>
      </S.MainContainer>
    </>
  )
}

export default HistoryPage
